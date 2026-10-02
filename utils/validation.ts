import { body, oneOf, param } from "express-validator";
import User from "../model/user";
import { http401Error } from "./customError";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const verifyHeaderToken: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) throw new http401Error("Access denied. No token provided.");
  jwt.verify(token, process.env.SESSION_SECRET as string, (error: any) => {
    if (error) {
      throw new http401Error("Token expired or invalid.");
    } else {
      next();
    }
  });
};

export const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("EMAIL_REQUIRED")
  .bail()
  .isEmail()
  .withMessage("EMAIL_NOT_VALID_FORMAT");

export const validateDuplicateEmail = body("email").custom(async (value) => {
  const existing = await User.findOne({ email: value });
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
});

export const validateEmailExist = body("email").custom(async (value) => {
  const existing = await User.findOne({ email: value });
  if (!existing) {
    throw new Error("EMAIL_DONT_EXISTS");
  }
});

export const validateUserExist = param("userId").custom(async (value) => {
  const existing = await User.findById(value);
  if (!existing) {
    throw new Error("USER_DONT_EXISTS");
  }
});

export const validatePassword = body("password")
  .trim()
  .notEmpty()
  .withMessage("PASSWORD_REQUIRED")
  .bail()
  .isLength({ min: 8 })
  .withMessage("PASSWORD_TOO_SHORT")
  .bail()
  .matches(/\d/)
  .withMessage("PASSWORD_NEEDS_NUMBER");
