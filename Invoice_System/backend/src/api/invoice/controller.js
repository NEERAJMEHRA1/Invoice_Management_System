//NPM
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
//Models
import customerModel from "../../models/customer.js";
import invoiceModel from "../../models/invoice.js";
//Functions
import logger from '../../../logger.js';
import { updateValidateInvoice, validateInvoice } from '../../helper/common/joiValidation.js';
import ResponseHelper from "../../helper/common/responseHelper.js";
import { HttpStatus } from "../../helper/common/constant.js";
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * @Method Method used to create invoice
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const createInvoice = async (req, res) => {
    try {
        const { error } = validateInvoice(req.body);
        if (error) {
            return ResponseHelper.validationError(res, error.details[0].message);
        }
        //decoded user id
        const userId = req.user.id;
        const { language, customerId } = req.body;

        // Calculate total amount
        const items = req.body.items.map(item => ({
            ...item,
            amount: (item.rate * item.quantity) - (item.discount || 0)
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

        // Check customer exists
        const customer = await customerModel.findOne({
            _id: customerId,
            createdBy: userId
        });

        if (!customer) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Customer_Not_Found', null);
        }

        // Check credit limit if applicable
        if (customer.creditLimit > 0) {
            const newCreditUsed = customer.creditUsed + totalAmount;
            if (newCreditUsed > customer.creditLimit) {
                return ResponseHelper.error(res, HttpStatus.TOO_MANY_REQUESTS, language, 'Invoice_Limit_Reached', null);
            }
        }

        // Create invoice
        const invoiceData = {
            ...req.body,
            customer: customerId,
            items,
            totalAmount,
            createdBy: userId
        };

        const invoice = await invoiceModel.create(invoiceData);

        // Update customer credit used
        if (customer.creditLimit > 0) {
            customer.creditUsed += totalAmount;
            await customer.save();
        }

        logger.info(`####****createInvoice : Invoice created successfully****#### `)
        return ResponseHelper.success(res, HttpStatus.CREATED, language, 'Invoice_Create_Success', invoice, null);

    } catch (error) {
        logger.error(`####****createInvoice : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to update invoice
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const updateInvoice = async (req, res) => {
    try {
        const { error } = updateValidateInvoice(req.body);
        if (error) {
            return ResponseHelper.validationError(res, error.details[0].message);
        }

        //decoded user id
        const userId = req.user.id;

        const { invoiceId, customerId, language } = req.body;
        if (!invoiceId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invoice_ID_Required', null);
        }

        let invoice = await invoiceModel.findById(invoiceId);

        console.log("invoice== ", invoice)
        if (!invoice) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Invoice_Not_Found', null);
        }

        // Check ownership
        if (invoice.createdBy.toString() !== userId.toString()) {
            return ResponseHelper.error(res, HttpStatus.UNAUTHORIZED, language, 'Unauthorized_User', null);
        }

        // Calculate total amount
        const items = req.body.items.map(item => ({
            ...item,
            amount: (item.rate * item.quantity) - (item.discount || 0)
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

        // Check customer exists
        const customer = await customerModel.findOne({
            _id: customerId,
            createdBy: userId
        });

        if (!customer) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Customer_Not_Found', null);
        }

        // Handle credit limit changes if customer changed
        if (invoice.customer.toString() !== customerId) {
            // Remove amount from old customer
            const oldCustomer = await customerModel.findById(invoice.customer);
            if (oldCustomer && oldCustomer.creditLimit > 0) {
                oldCustomer.creditUsed = Math.max(0, oldCustomer.creditUsed - invoice.totalAmount);
                await oldCustomer.save();
            }

            // Check new customer's credit limit
            if (customer.creditLimit > 0) {
                const newCreditUsed = customer.creditUsed + totalAmount;
                if (newCreditUsed > customer.creditLimit) {
                    return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invoice_Limit_Reached', null);
                }
            }
        } else if (customer.creditLimit > 0) {
            // Same customer, check if amount changed
            const creditDifference = totalAmount - invoice.totalAmount;
            const newCreditUsed = customer.creditUsed + creditDifference;

            if (newCreditUsed > customer.creditLimit) {
                return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Amount_Exceeds', null);
            }
        }

        // Update invoice
        invoice = await invoiceModel.findByIdAndUpdate(
            invoiceId,
            {
                ...req.body,
                items,
                totalAmount
            },
            { new: true, runValidators: true }
        ).populate('customer', 'name companyName email phone');

        // Update customer credit used if needed
        if (customer.creditLimit > 0) {
            if (invoice.customer.toString() !== customerId) {
                customer.creditUsed += totalAmount;
            } else {
                customer.creditUsed += (totalAmount - invoice.totalAmount);
            }
            await customer.save();
        }

        logger.info(`####****updateInvoice : Invoice updated successfully****#### `)
        return ResponseHelper.success(res, HttpStatus.OK, language, 'Invoice_Update_Success', invoice, null);
    } catch (error) {
        logger.error(`####****updateInvoice : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to get invoice by id
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const getInvoice = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;

        const invoiceId = req.query.invoiceId;
        const language = req.query.language;

        if (!invoiceId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invoice_ID_Required', null);
        }

        const invoice = await invoiceModel.findById(invoiceId)
            .populate('customer', 'name companyName address city zipCode phone email')
            .populate('createdBy', 'name companyName address city zipCode phone');

        if (!invoice) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Invoice_Not_Found', error.message);
        }

        // Check ownership
        if (invoice.createdBy._id.toString() !== userId.toString()) {
            return ResponseHelper.error(res, HttpStatus.UNAUTHORIZED, language, 'Unauthorized_User', null);
        }

        logger.info(`####****getInvoice : Get invoice details successfully****####`);
        return ResponseHelper.success(res, HttpStatus.OK, language, 'Data_Found', invoice, null);
    } catch (error) {
        logger.error(`getInvoice : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to get all invoice list
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const getAllInvoices = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;

        const { language, page = 1, limit = 10, search = '', customer, startDate, endDate, sort = '-date' } = req.query;

        // Build query
        const query = { createdBy: new mongoose.Types.ObjectId(userId) };

        // Search filter
        if (search) {
            query.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }

        // Customer filter
        if (customer) {
            query.customer = customer;
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const invoices = await invoiceModel.find(query)
            .populate('customer', 'name companyName email phone')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await invoiceModel.countDocuments(query);

        // Calculate summary
        const summary = await invoiceModel.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
        ]);

        logger.info(`####****getAllInvoices : List of all invoices fetched successfully****####`);
        return res.status(200).send({
            totalPages: Math.ceil(count / limit),
            currentPage: +page,
            totalRecords: count,
            totalAmount: summary[0]?.totalAmount || 0,
            data: invoices,
        });
    } catch (error) {
        logger.error(`####****getAllInvoices : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to delete invoice by id
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const deleteInvoice = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;

        const language = req.query.language;
        const invoiceId = req.query.invoiceId;

        if (!invoiceId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invoice_ID_Required', null);
        }

        const invoice = await invoiceModel.findById(invoiceId);
        if (!invoice) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Invoice_Not_Found', null);
        }

        // Check ownership
        if (invoice.createdBy.toString() !== userId.toString()) {
            return ResponseHelper.error(res, HttpStatus.UNAUTHORIZED, language, 'Unauthorized_User', null);
        }

        // Update customer credit if applicable
        const customer = await customerModel.findById(invoice.customer);
        if (customer && customer.creditLimit > 0) {
            customer.creditUsed = Math.max(0, customer.creditUsed - invoice.totalAmount);
            await customer.save();
        }

        // await invoice.remove();
        await invoiceModel.deleteOne({ _id: invoiceId });


        logger.info(`####****deleteInvoice : Invoice Deleted Success****####`);
        return ResponseHelper.success(res, HttpStatus.OK, language, 'Invoice_Deleted_Success', null);

    } catch (error) {
        logger.error(`deleteInvoice : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to generate invoice PDF
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const generateInvoicePDF = async (req, res) => {
    try {
        //decoded user id
        const userId = req.user.id;

        const language = req.query.language;
        const invoiceId = req.query.invoiceId;

        if (!invoiceId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invoice_ID_Required', null);
        }

        const invoice = await invoiceModel.findById(invoiceId)
            .populate('customer', 'name companyName address city zipCode phone email')
            .populate('createdBy', 'name companyName address city zipCode phone');

        if (!invoice) {
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Invoice_Not_Found', null);
        }

        // Check ownership
        if (invoice.createdBy._id.toString() !== userId.toString()) {
            return ResponseHelper.error(res, HttpStatus.UNAUTHORIZED, language, 'Unauthorized_User', null);
        }

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `invoice_${invoice.invoiceNumber}.pdf`;
        const filePath = path.join(__dirname, '../temp', fileName);

        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'));
        }

        // Pipe PDF to file and response
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.pipe(res);

        // Add header
        doc.fontSize(20).text(invoice.createdBy.companyName || 'INVOICE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Invoice #: ${invoice.invoiceNumber}`, { align: 'right' });
        doc.text(`Date: ${invoice.date.toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Add customer info
        doc.fontSize(14).text('Bill To:', { underline: true });
        doc.fontSize(12);
        doc.text(invoice.customer.name);
        if (invoice.customer.companyName) doc.text(invoice.customer.companyName);
        doc.text(invoice.customer.address);
        doc.text(`${invoice.customer.city} ${invoice.customer.zipCode}`);
        doc.text(invoice.customer.phone);
        doc.text(invoice.customer.email);
        doc.moveDown();

        // Add invoice items table
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, tableTop);
        doc.text('Rate', 300, tableTop, { width: 60, align: 'right' });
        doc.text('Qty', 370, tableTop, { width: 50, align: 'right' });
        doc.text('Amount', 430, tableTop, { width: 80, align: 'right' });
        doc.font('Helvetica');

        let y = tableTop + 25;
        invoice.items.forEach((item, i) => {
            doc.text(item.description, 50, y);
            doc.text(item.rate.toFixed(2), 300, y, { width: 60, align: 'right' });
            doc.text(item.quantity.toString(), 370, y, { width: 50, align: 'right' });
            doc.text(item.amount.toFixed(2), 430, y, { width: 80, align: 'right' });
            y += 20;
        });

        // Add total
        doc.moveTo(50, y).lineTo(510, y).stroke();
        y += 20;
        doc.font('Helvetica-Bold');
        doc.text('Total', 350, y);
        doc.text(invoice.totalAmount.toFixed(2), 430, y, { width: 80, align: 'right' });
        doc.font('Helvetica');

        // Add remarks if exists
        if (invoice.remarks) {
            doc.moveDown();
            doc.text('Remarks:', { underline: true });
            doc.text(invoice.remarks);
        }

        // Add footer
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

        // Finalize PDF
        doc.end();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        // Clean up file after sending
        writeStream.on('finish', () => {
            fs.unlink(filePath, (err) => {
                if (err) logger.error(`Error deleting temp PDF file: ${err.message}`);
            });
        });
    } catch (error) {
        logger.error(`generateInvoicePDF : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to calculate invoice analytics for home page
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const getInvoiceAnalytics = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;

        // Monthly sales data
        const monthlySales = await invoiceModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalSales: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 12 }
        ]);

        // Top customers
        const topCustomers = await invoiceModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$customer",
                    totalAmount: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "customers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" },
            {
                $project: {
                    customerName: "$customer.name",
                    companyName: "$customer.companyName",
                    totalAmount: 1,
                    count: 1
                }
            }
        ]);

        return res.status(200).send({
            monthlySales,
            topCustomers
        });
    } catch (error) {
        logger.error(`getInvoiceAnalytics : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};