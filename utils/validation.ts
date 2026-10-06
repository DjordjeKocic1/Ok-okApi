import { body, check, param } from "express-validator";
import User from "../model/user";
import Service from "../model/service";
import ServiceRequest from "../model/serviceRequest";

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
  const exists = await User.exists({ _id: req.userId });
  if (!exists) throw new Error("USER_DONT_EXISTS");
});

export const validateDuplicateEmail = body("email").custom(async (value) => {
  const existing = await User.exists({ email: value });
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
});

export const validateEmailExist = body("email").custom(async (value) => {
  const existing = await User.exists({ email: value });
  if (!existing) {
    throw new Error("EMAIL_DONT_EXISTS");
  }
});

export const validateServiceRequestExist = param("requestId")
  .isMongoId()
  .withMessage("INVALID_ID")
  .bail()
  .custom(async (value) => {
    const existing = await ServiceRequest.exists({ _id: value });
    if (!existing) {
      throw new Error("REQUEST_NOT_FOUND");
    }
  });

const serviceExists = (location: typeof body | typeof param, field: string) =>
  location(field)
    .isMongoId()
    .withMessage("INVALID_ID")
    .bail()
    .custom(async (value) => {
      const exists = await Service.exists({ _id: value });
      if (!exists) throw new Error("SERVICE_DONT_EXISTS");
    });

export const validateServiceExist = serviceExists(param, "serviceId");
export const validateBodyServiceExist = serviceExists(body, "service");
