"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBodyServiceExist = exports.validateServiceExist = exports.validateServiceRequestExist = exports.validateEmailExist = exports.validateDuplicateEmail = exports.validateAuthUser = exports.validatePassword = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../model/user"));
const service_1 = __importDefault(require("../model/service"));
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
exports.validateEmail = (0, express_validator_1.body)("email")
    .trim()
    .notEmpty()
    .withMessage("EMAIL_REQUIRED")
    .bail()
    .isEmail()
    .withMessage("EMAIL_NOT_VALID_FORMAT");
exports.validatePassword = (0, express_validator_1.body)("password")
    .trim()
    .notEmpty()
    .withMessage("PASSWORD_REQUIRED")
    .bail()
    .isLength({ min: 8 })
    .withMessage("PASSWORD_TOO_SHORT")
    .bail()
    .matches(/\d/)
    .withMessage("PASSWORD_NEEDS_NUMBER");
exports.validateAuthUser = (0, express_validator_1.check)().custom((_value_1, _a) => __awaiter(void 0, [_value_1, _a], void 0, function* (_value, { req }) {
    const exists = yield user_1.default.exists({ _id: req.userId });
    if (!exists)
        throw new Error("USER_DONT_EXISTS");
}));
exports.validateDuplicateEmail = (0, express_validator_1.body)("email").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_1.default.exists({ email: value });
    if (existing) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
}));
exports.validateEmailExist = (0, express_validator_1.body)("email").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_1.default.exists({ email: value });
    if (!existing) {
        throw new Error("EMAIL_DONT_EXISTS");
    }
}));
exports.validateServiceRequestExist = (0, express_validator_1.param)("requestId")
    .isMongoId()
    .withMessage("REQUEST_INVALID_ID")
    .bail()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield serviceRequest_1.default.exists({ _id: value });
    if (!existing) {
        throw new Error("REQUEST_NOT_FOUND");
    }
}));
const serviceExists = (location, field) => location(field)
    .isMongoId()
    .withMessage("SERVICE_INVALID_ID")
    .bail()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield service_1.default.exists({ _id: value });
    if (!exists)
        throw new Error("SERVICE_DONT_EXISTS");
}));
exports.validateServiceExist = serviceExists(express_validator_1.param, "serviceId");
exports.validateBodyServiceExist = serviceExists(express_validator_1.body, "service");
