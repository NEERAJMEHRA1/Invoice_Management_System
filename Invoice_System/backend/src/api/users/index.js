import express from "express";
const router = express.Router();
import upload from "../../helper/common/multerConfig.js";
import { validator } from "../../helper/common/validator.js";
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import {
    userLogin,
    deleteUser,
    userRegister,
    getUserDetail,
    changePassword,
    updateUserDetail,
    uploadLogo,
    userLogOut,
} from "./controller.js";

router.post("/userLogin", userLogin);
router.delete("/deleteUser", authMiddleware, deleteUser);
router.get("/getUserDetail", authMiddleware, getUserDetail);
router.patch("/changePassword", authMiddleware, changePassword);
router.put("/updateUserDetail", authMiddleware, validator("updateValidation"), updateUserDetail);
router.post("/userRegister", validator("registerValidation"), userRegister);
router.post("/upload", authMiddleware, upload.single("companyLogo"), uploadLogo);
router.get("/userLogOut", authMiddleware, userLogOut);

export default router;