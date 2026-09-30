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
exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const customError_1 = require("../utils/customError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const password = req.body.password;
        if (!password) {
            throw new customError_1.http422Error("Password is required");
        }
        if (!constants_1.passwordRegex.test(password)) {
            throw new customError_1.http422Error("Password too weak");
        }
        const cryptedPassword = yield bcryptjs_1.default.hash(password.replace(" ", ""), 12);
        const user = new user_1.default({
            email: req.body.email,
            password: cryptedPassword,
        });
        const userCreate = yield user.save();
        return res.status(201).json({ user: userCreate });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
