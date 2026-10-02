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
exports.validatePassword = exports.validateUserExist = exports.validateEmailExist = exports.validateDuplicateEmail = exports.validateEmail = exports.verifyHeaderToken = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../model/user"));
const customError_1 = require("./customError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyHeaderToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token)
        throw new customError_1.http401Error("Access denied. No token provided.");
    jsonwebtoken_1.default.verify(token, process.env.SESSION_SECRET, (error) => {
        if (error) {
            throw new customError_1.http401Error("Token expired or invalid.");
        }
        else {
            next();
        }
    });
};
exports.verifyHeaderToken = verifyHeaderToken;
exports.validateEmail = (0, express_validator_1.body)("email")
    .trim()
    .notEmpty()
    .withMessage("EMAIL_REQUIRED")
    .bail()
    .isEmail()
    .withMessage("EMAIL_NOT_VALID_FORMAT");
exports.validateDuplicateEmail = (0, express_validator_1.body)("email").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_1.default.findOne({ email: value });
    if (existing) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
}));
exports.validateEmailExist = (0, express_validator_1.body)("email").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_1.default.findOne({ email: value });
    if (!existing) {
        throw new Error("EMAIL_DONT_EXISTS");
    }
}));
exports.validateUserExist = (0, express_validator_1.param)("userId").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_1.default.findById(value);
    if (!existing) {
        throw new Error("USER_DONT_EXISTS");
    }
}));
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
