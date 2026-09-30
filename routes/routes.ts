import express, { Router } from "express";
import { createUser } from "../controllers/userController";
import { validateEmail, validatePassword } from "../utils/validation";
const router = express.Router();

//Auth Routes
router.post(
  "/auth/create-account",
  validateEmail,
  validatePassword,
  createUser,
);

export default router;
