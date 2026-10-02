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
exports.getUser = exports.userLogin = exports.createUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../model/user"));
const customError_1 = require("../utils/customError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const cryptedPassword = yield bcryptjs_1.default.hash(req.body.password.replace(" ", ""), 12);
        const user = new user_1.default({
            email: req.body.email,
            password: cryptedPassword,
        });
        yield user.save();
        return res.status(204).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const token = jsonwebtoken_1.default.sign({ email: req.body.email }, process.env.SESSION_SECRET, {
            expiresIn: "90d",
        });
        const userFind = (yield user_1.default.findOne({
            email: req.body.email,
        }));
        const passwordCompare = yield bcryptjs_1.default.compare(req.body.password.replace(" ", ""), userFind.password);
        if (!passwordCompare) {
            throw new customError_1.http422Error("WRONG_PASSWORD");
        }
        res.status(200).json({
            user: {
                id: userFind._id,
                email: userFind.email,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.isValidObjectId(id)) {
            throw new customError_1.http404Error("INVALID_USER_ID");
        }
        const user = yield user_1.default.findById(id);
        if (!user) {
            throw new customError_1.http422Error("USER_DONT_EXITS");
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
