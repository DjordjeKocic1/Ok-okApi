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
exports.rateUser = void 0;
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
const review_1 = __importDefault(require("../model/review"));
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
const user_1 = __importDefault(require("../model/user"));
const service_1 = __importDefault(require("../model/service"));
const rateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const request = yield serviceRequest_1.default.findOne({
            _id: req.params.requestId,
            status: "accepted",
        });
        if (!request)
            throw new customError_1.http422Error("REQUEST_NOT_FOUND");
        if (request.fromUser.toString() !== req.userId)
            throw new customError_1.http422Error("CANT_REVIEW_YOURSELF");
        const service = yield service_1.default.findById(request.service);
        if (!service || service.status !== "completed")
            throw new customError_1.http422Error("SERVICE_NOT_COMPLETED");
        const alreadyReviewed = yield review_1.default.exists({
            fromUser: req.userId,
            request: request._id,
        });
        if (alreadyReviewed)
            throw new customError_1.http422Error("REVIEW_ALREADY_EXISTS");
        const review = new review_1.default({
            fromUser: req.userId,
            toUser: request.toUser,
            request: request._id,
            rating: req.body.rating,
            comment: req.body.comment,
        });
        yield review.save();
        yield user_1.default.findByIdAndUpdate(request.toUser, {
            $inc: { ratingSum: req.body.rating, ratingCount: 1 },
        });
        const requestToUpdate = yield serviceRequest_1.default.findOneAndUpdate({
            _id: req.params.requestId,
            rated: false,
            status: "accepted",
            fromUser: req.userId,
        }, { rated: true });
        if (!requestToUpdate)
            throw new customError_1.http422Error("REQUEST_NOT_FOUND_OR_ALREADY_RATED");
        res.status(201).json({ message: "REVIEW_CREATED" });
    }
    catch (error) {
        next(error);
    }
});
exports.rateUser = rateUser;
