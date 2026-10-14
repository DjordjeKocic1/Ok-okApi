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
exports.deleteUser = exports.updateUserPassword = exports.updateUser = exports.getUser = exports.userLogin = exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const customError_1 = require("../utils/customError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const service_1 = __importDefault(require("../model/service"));
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
const review_1 = __importDefault(require("../model/review"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const cryptedPassword = yield bcryptjs_1.default.hash(req.body.password.replace(" ", ""), 12);
        const user = new user_1.default({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: cryptedPassword,
        });
        yield user.save();
        res.status(201).send("success");
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
        const userFind = (yield user_1.default.findOne({
            email: req.body.email,
        }));
        const passwordCompare = yield bcryptjs_1.default.compare(req.body.password.replace(" ", ""), userFind.password);
        if (!passwordCompare) {
            throw new customError_1.http422Error("WRONG_PASSWORD");
        }
        const token = jsonwebtoken_1.default.sign({ userId: userFind._id }, process.env.SESSION_SECRET, { expiresIn: "90d" });
        res.status(200).json({
            user: {
                email: userFind.email,
                firstName: userFind.firstName,
                lastName: userFind.lastName,
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
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const user = (yield user_1.default.findById(req.userId).select("-password"));
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const { firstName, lastName, phone, searchedDestinations } = req.body;
        const update = {
            $set: { firstName, lastName, phone },
        };
        if (Array.isArray(searchedDestinations)) {
            if (searchedDestinations.length === 0) {
                update.$set = Object.assign(Object.assign({}, update.$set), { searchedDestinations: [] });
            }
            else {
                update.$push = {
                    searchedDestinations: {
                        $each: searchedDestinations,
                        $slice: -2,
                    },
                };
            }
        }
        const user = yield user_1.default.findByIdAndUpdate(req.userId, update, {
            returnDocument: "after",
            runValidators: true,
        }).select("-password");
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const { password, newPassword } = req.body;
        const user = (yield user_1.default.findById(req.userId));
        const matchsCurrentPassword = yield bcryptjs_1.default.compare(password.replace(" ", ""), user.password);
        if (!matchsCurrentPassword)
            throw new customError_1.http422Error("WRONG_PASSWORD");
        const samePassword = yield bcryptjs_1.default.compare(newPassword.replace(" ", ""), user.password);
        if (samePassword)
            throw new customError_1.http422Error("NEW_PASSWORD_SAME_AS_OLD");
        user.password = yield bcryptjs_1.default.hash(newPassword.replace(" ", ""), 12);
        yield user.save();
        res.status(200).json("success");
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserPassword = updateUserPassword;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        yield service_1.default.deleteMany({ user: req.userId });
        yield serviceRequest_1.default.deleteMany({ fromUser: req.userId });
        yield review_1.default.deleteMany({ toUser: req.userId });
        yield review_1.default.updateMany({ fromUser: req.userId }, { $set: { fromUser: null } }, { overwriteImmutable: true });
        yield user_1.default.findOneAndDelete({ _id: req.userId });
        res.status(200).json("success");
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
