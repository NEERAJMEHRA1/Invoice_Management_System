import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import userModel from "../../models/users.js";
import customerModel from "../../models/customer.js";
import customerResponse from "../../response/customerResponse.js";
import logger from "../../../logger.js";

/**
 * @Method Method used for get user data by email
 * @author Neeraj-Mehra
 * @param {*} email 
 * @date 12-JUNE-2025
 */
export const emailExist = async (email, userId) => {
    try {
        //get customer data by email
        const getUserData = await customerModel.findOne({ email: email, createdBy: new mongoose.Types.ObjectId(userId) }).lean();
        console.log("fff--> ", getUserData)
        if (getUserData) {
            return true;
        }
        return false;

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @Method Method used for get customer data by id and userId
 * @author Neeraj-Mehra
 * @param {*} userId 
 * @date 12-JUNE-2025
 */
export const getCustomerById = async (userId, customerId) => {
    try {

        //get user data
        const userData = await customerModel.findOne({ _id: customerId, createdBy: userId }).lean();

        return userData;

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @Method method used to get user by email
 * @param {*} email 
 * @date 12-JUNE-2025
 */
export const getUserByEmail = async (email) => {
    try {
        //get user by email
        const getUser = await userModel.findOne({ email: email });
        return getUser;

    } catch (error) {
        throw new Error(error.message);
    }
}/**
 * @Method used create directory
 * @author Neeraj-Mehra
 * @date 12-JUNE-2025
 */
export const createDirectory = async (targetDir) => {
    try {
        const sep = path.sep;

        const initDir = path.isAbsolute(targetDir) ? sep : "";
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
                fs.chmodSync(curDir, 777);
            }
            return curDir;
        }, initDir);
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * @Method used to get all customer
 * @author Neeraj-Mehra
 * @date 12-JUNE-2025
 */
export const customerList = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { language, page, perPage } = req.body;
            //decoded user id
            const userId = req.user.id;
            logger.info("customerList : Call userId=== " + userId)

            //pagination
            const pageNo = page ? (page - 1) * perPage : 0;

            //sorting according to fields and sort asc/dsce
            let sorting = { _id: -1 };

            let filter = { createdBy: new mongoose.Types.ObjectId(userId) };

            //get category total count
            const totalCount = await customerModel.find(filter).countDocuments({});

            // get customer  data with and without filter
            const customerData = await customerModel.find(filter)
                .limit(perPage)
                .skip(pageNo)
                .sort(sorting)
                .lean();

            //if found catagory data,send response
            if (customerData && customerData.length != 0) {
                const promise = customerData.map(async (customer) => {
                    customer.createdBy = customer && customer.createdBy ? customer.createdBy.name : "";

                    //return customer data
                    return new customerResponse(customer);
                });

                const customerDataList = await Promise.all(promise);

                logger.info("customerList : Get customer listing  successfully");
                resolve(customerDataList)
            } else {
                resolve(false)
            }
        } catch (error) {
            logger.info("customerList : Error==>> " + error);
            resolve(false)
        }
    });
}

const generateInvoiceNumber = async () => {
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    return lastInvoice ? lastInvoice.invoiceNumber + 1 : 1000;
};
