//NPM
import fs from "fs";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import converter from "json-2-csv";
import { validationResult } from "express-validator";
//Models
import userModel from "../../models/users.js";
import customerModel from "../../models/customer.js";
//Response
import userResponse from "../../response/userResponse.js";
import customerResponse from "../../response/customerResponse.js";
//Functions
import logger from '../../../logger.js';
import config from "../../helper/envconfig/envVars.js";
import { emailExist, getCustomerById, createDirectory, customerList } from "./service.js";
import { getMessage } from "../../helper/common/helpers.js";
import ResponseHelper from "../../helper/common/responseHelper.js";
import { HttpStatus } from "../../helper/common/constant.js";
import moment from "moment-timezone";


/**
 * @Method Method used to add customer by users
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const addCustomer = async (req, res) => {
    try {
        const { language = "en", name, email, companyName, address, city, zipCode, phone, creditLimit } = req.body;

        if (!email) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Email_Id_Required', null);
        }

        //decoded user id
        const userId = req.user.id;
        logger.info(`addCustomer : userId==> ${userId} AND Req body==>> ${JSON.stringify(req.body)}`);

        //use validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: await getMessage(language, errors.errors[0]["msg"]),
            })
        }

        //email valid regex
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Invalid_Email_Address', null);
        }

        //email convert in lower case
        const lowerEmail = email.toLowerCase();

        //function used to check email already exist or not
        const checkEmail = await emailExist(lowerEmail, userId);
        if (checkEmail) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Email_Already_Exist', null);
        }

        //save data
        const customerObj = new customerModel({
            createdBy: userId,
            name: name || "",
            email: lowerEmail,
            companyName: companyName,
            address: address || "",
            city: city,
            zipCode: zipCode,
            phone: phone || "",
            creditLimit: creditLimit,
        });

        const customerSave = await customerObj.save();

        if (customerSave) {
            logger.info(`####****addCustomer : Customer added successfully****####`);
            return ResponseHelper.success(res, HttpStatus.OK, language, 'Customer_Added_Success', null, null);
        }

        logger.info(`####****addCustomer : Feild to add customer****####`);

        return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Feild_To_Add_Customer', null);

    } catch (error) {
        logger.error(`####****addCustomer : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to get user details
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const getCustomerDetail = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;
        const language = req.query.language;
        const customerId = req.query.customerId;

        if (!customerId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, 'en', 'Customer_ID_Required', null);
        }

        //get user data by id
        const getCustomerData = await getCustomerById(userId, customerId);

        if (getCustomerData) {

            const userdata = new customerResponse(getCustomerData);

            logger.info(`####****getUserDetail : User details fetch successfully****####`);
            return ResponseHelper.success(res, HttpStatus.OK, language, 'Get_User_Details_Success', userdata);
        };

        logger.info(`####****getUserDetail : User not found id==>> ${userId}`);
        return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Data_Not_Found', null);

    } catch (error) {
        logger.error(`getUserDetail : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};

/**
 * @Method Method used to update customer by user
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2024
 */
export const editCustomer = async (req, res) => {
    try {
        const { language = "en", customerId, name, companyName, address, city, zipCode, phone, creditLimit } = req.body;

        //decoded user id
        const userId = req.user.id;

        if (!customerId) {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Customer_ID_Required', null);
        }
        //use validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: await getMessage(language, errors.errors[0]["msg"]),
            })
        }

        logger.info(`editCustomer : userId==>> ${userId} AND Req body==>> ${JSON.stringify(req.body)}`);

        //get user data by id 
        const customerData = await getCustomerById(userId, customerId);
        if (customerData) {

            //update customer data
            const updateData = await customerModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(customerId) },
                {
                    $set: {
                        name,
                        companyName,
                        address,
                        city,
                        zipCode,
                        phone,
                        creditLimit,
                    }
                },
                { new: true }
            );

            if (updateData) {

                logger.info(`####****editCustomer : Update customer details successfully****####`);
                //user response
                const userData = new customerResponse(updateData);
                return ResponseHelper.success(res, HttpStatus.OK, language, 'Update_Customer_Details', userData);
            }

            logger.info(`####****editCustomer : Field to update user details****####`);
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Field_Update_User_Details', null);

        } else {
            logger.info(`####****editCustomer : User not found==>> ${userId}`);
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, language, 'Data_Not_Found', null);
        }

    } catch (error) {
        logger.error(`editCustomer : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
}

/**
 * @Method Method used to get all user, customer list with filter and pagination
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const getCustomerList = async (req, res) => {
    try {
        const { language, search, page = 1, perPage = 10, } = req.body;

        //decode user id
        const userId = req.user.id;

        //pagination
        const pageNo = (page - 1) * perPage;

        let filter = { createdBy: userId };
        //search filter
        if (search) {
            const reg = {
                name: { $regex: ".*" + search + ".*", $options: "i" }
            };

            filter = Object.assign(filter, reg);
        }

        logger.info(`getCustomerList : userId==>> ${userId} AND filter==>> ${JSON.stringify(filter)}`);

        //get user list
        const getAllUsers = await customerModel.find(filter)
            .sort({ _id: -1 })
            .skip(pageNo)
            .limit(perPage);

        if (getAllUsers && getAllUsers.length) {
            const madeUserResponse = await Promise.all(getAllUsers.map(async (user) => {
                return new customerResponse(user);
            })//map
            )//promise

            //get total count
            const totalCount = await customerModel.countDocuments(filter);

            logger.info(`getCustomerList : total count==>> ` + totalCount);
            logger.error(`####****getCustomerList : customer list fetched successfully****####`);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "Customer_List_Fetched_Success"),
                totalCount: totalCount,
                data: madeUserResponse,

            })
        } else {
            logger.error(`####****getCustomerList : Data not found****####`);
            return ResponseHelper.error(res, HttpStatus.NOT_FOUND, 'en', 'Data_Not_Found', []);
        }

    } catch (error) {
        logger.error(`getCustomerList : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
}

/**
 * @Method Method used to delete customer by id
 * @param {*} req 
 * @param {*} res 
 * @date 12-JUNE-2025
 */
export const deleteCustomer = async (req, res) => {
    try {
        //decoded user id
        const userId = req.user.id;
        const language = req.query.language;
        const customerId = req.query.customerId;

        logger.info(`deleteCustomer : userId==>> ${userId}`);

        if (userId && customerId) {
            //delete user from DB
            const deleteUser = await customerModel.deleteOne({ _id: customerId, createdBy: userId });

            if (deleteUser) {
                logger.info(`deleteCustomer : Customer deleted successfully==> ${customerId}`);
                return ResponseHelper.success(res, HttpStatus.OK, language, 'Customer_Delete_Success', null);
            };

            logger.info(`deleteCustomer : Field to delete customer==> ${customerId}`);
            return res.send({
                status: false,
                message: "Feild to delete customer."
            })
        } else {
            return ResponseHelper.error(res, HttpStatus.BAD_REQUEST, language, 'Something_Want_Wrong', null);
        }
    } catch (error) {
        logger.error(`deleteCustomer : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
};


/**
 * @Method used to download CSV
 * @author Neeraj-Mehra
 * @date 12-JUNE-2025
 */
export const customerCsvDownload = async function (req, res) {
    try {
        const { language, folderName } = req.body;

        //decoded user id
        const userId = req.user.id;
        const IMAGE_UPLOAD_DIR = "assets/" + folderName;
        await createDirectory(IMAGE_UPLOAD_DIR);

        logger.info("customerCsvDownload : userId==>> " + userId);
        const newFinalData = await customerList(req);

        if (newFinalData) {
            let csvArray = [];
            const promise = newFinalData.map(async (data) => {
                let csvObj = {};

                csvObj.name = data.name;
                csvObj.email = data.email;
                csvObj.companyName = data.companyName;
                csvObj.phone = data.phone;
                csvObj.address = data.address;
                csvObj.city = data.city;
                csvObj.zipCode = data.zipCode;
                csvObj.creditLimit = data.creditLimit;
                csvObj.creditUsed = data.creditUsed || 0;
                csvObj.createdAt = moment(data.createdAt).format("YYYY-MM-DD");
                csvArray.push(csvObj);
            });
            await Promise.all(promise);

            let csvfilePath = IMAGE_UPLOAD_DIR + "/customer.csv";
            const data1 = await converter.json2csv(csvArray);
            if (data1) {
                fs.writeFileSync(csvfilePath, data1, (err) => {
                    if (err) {
                        console.log("Error writing CSV file:", err);
                    } else {
                        console.log("CSV file created successfully.");
                    }
                });
                fs.readFile(csvfilePath, "utf8", (err, data) => {
                    if (err) {
                        console.error("Error reading CSV file:", err);
                    } else {
                        console.log(data); // The content of the CSV file as a string
                    }
                });
                logger.info(
                    "customerCsvDownload : CSV cretae successfully=== " + csvfilePath
                );

                const csvUrlPath = config.IMAGE_ACCESS_URL + "assets/csvFiles/customer.csv";
                return res.status(200).send({
                    status: true,
                    message: await getMessage(language, "CSV_Create_Success"),
                    path: csvUrlPath,
                });
            } else {
                return res.status(200).send({
                    status: false,
                    message: await getMessage(language, "Failed_CSV_Create"),
                });
            }
        } else {
            return res.status(400).send({
                status: 0,
                message: getString(language, "Failed_CSV_Create"),
            });
        }
    } catch (error) {
        logger.error(`customerCsvDownload : Error==>> ${error}`);
        return ResponseHelper.error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'en', 'Internal_Server_Error', error.message);
    }
}