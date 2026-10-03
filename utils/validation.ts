import { body, check, param } from "express-validator";
import User from "../model/user";
import Service from "../model/service";

export const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("EMAIL_REQUIRED")
  .bail()
  .isEmail()
  .withMessage("EMAIL_NOT_VALID_FORMAT");

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

export const validateAuthUser = check().custom(async (_value, { req }) => {
  const exists = await User.findById(req.userId);
  if (!exists) throw new Error("USER_DONT_EXISTS");
});

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

const serviceExists = (location: typeof body | typeof param, field: string) =>
  location(field)
    .isMongoId()
    .withMessage("SERVICE_INVALID_ID")
    .bail()
    .custom(async (value) => {
      const exists = await Service.exists({ _id: value });
      if (!exists) throw new Error("SERVICE_DONT_EXISTS");
    });

export const validateServiceExist = serviceExists(param, "serviceId");
export const validateBodyServiceExist = serviceExists(body, "service");
