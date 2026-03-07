import express, { type Router } from "express";
import authController from "../controller/authController.js";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/logout", authenticate, authController.logout);
router.post("/change-password", authenticate, authController.changePassword);
router.get("/me", authenticate, authController.getMe);

export default router;
