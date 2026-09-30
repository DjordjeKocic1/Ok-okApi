import { body } from "express-validator";
import User from "../model/user";

export const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Email is not a valid format")
  .normalizeEmail()
  .custom(async (value) => {
    const existing = await User.findOne({ email: value });
    if (existing) {
      throw new Error("Email already exists");
    }
  });

export const validatePassword = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .bail()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .bail()
  .matches(/\d/)
  .withMessage("Password must contain at least one number");
