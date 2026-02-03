import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify", authUser, verifyRazorpayPayment);

export default router;
