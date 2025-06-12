import express from "express";
const router = express.Router();
import upload from "../../helper/common/multerConfig.js";
import { validator } from "../../helper/common/validator.js";
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import {
    addCustomer,
    deleteCustomer,
    getCustomerDetail,
    editCustomer,
    getCustomerList,
    customerCsvDownload,
} from "./controller.js";

router.post("/addCustomer", authMiddleware, validator("addCustomer"), addCustomer);
router.delete("/deleteCustomer", authMiddleware, deleteCustomer);
router.post("/getCustomerList", authMiddleware, getCustomerList);
router.get("/getCustomerDetail", authMiddleware, getCustomerDetail);
router.put("/editCustomer", authMiddleware, validator("addCustomer"), editCustomer);
router.post("/customerCsvDownload", authMiddleware, customerCsvDownload);

export default router;