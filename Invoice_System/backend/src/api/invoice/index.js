import express from "express";
const router = express.Router();
import upload from "../../helper/common/multerConfig.js";
import { validator } from "../../helper/common/validator.js";
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import {
    createInvoice,
    updateInvoice,
    getInvoice,
    getAllInvoices,
    deleteInvoice,
    generateInvoicePDF,
    getInvoiceAnalytics,
} from "./controller.js";

router.post("/createInvoice", authMiddleware, createInvoice);
router.put("/updateInvoice", authMiddleware, updateInvoice);
router.get("/getInvoice", authMiddleware, getInvoice);
router.post("/getAllInvoices", authMiddleware, getAllInvoices);
router.delete("/deleteInvoice", authMiddleware, deleteInvoice);
router.get("/generateInvoicePDF", authMiddleware, generateInvoicePDF);
router.get("/getInvoiceAnalytics", authMiddleware, getInvoiceAnalytics);

export default router;