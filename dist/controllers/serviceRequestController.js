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
exports.updateServiceRequestStatus = exports.createServiceRequest = exports.updateServiceRequest = exports.getServiceRequests = void 0;
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
const service_1 = __importDefault(require("../model/service"));
const getServiceRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const serviceRequest = yield serviceRequest_1.default.find({
            fromUser: req.userId,
        }).populate({
            path: "service",
            select: "status destinationStart destinationEnd departureTime transportMode spotsAvailable cost",
            populate: {
                path: "user",
                select: "firstName lastName ratingSum ratingCount",
            },
        });
        res.status(200).json({ serviceRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.getServiceRequests = getServiceRequests;
const updateServiceRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const { transportDescription, packageWeight, specialRequest, specialRequestCost, } = req.body;
        const serviceRequest = yield serviceRequest_1.default.findOneAndUpdate({
            _id: req.params.requestId,
            fromUser: req.userId,
            status: "pending",
        }, {
            transportDescription,
            packageWeight,
            specialRequest,
            specialRequestCost,
        }, { returnDocument: "after", runValidators: true });
        if (!serviceRequest) {
            throw new customError_1.http404Error("REQUEST_NOT_FOUND");
        }
        res.status(200).json({ serviceRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.updateServiceRequest = updateServiceRequest;
const createServiceRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = (yield service_1.default.findById(req.body.service));
        if (service.spotsAvailable === 0) {
            throw new customError_1.http422Error("NO_SPOTS_AVAILABLE");
        }
        if (service.user.toString() === req.userId) {
            throw new customError_1.http422Error("CANNOT_REQUEST_OWN_SERVICE");
        }
        const alreadyRequested = yield serviceRequest_1.default.exists({
            service: service._id,
            fromUser: req.userId,
        });
        if (alreadyRequested) {
            throw new customError_1.http422Error("REQUEST_ALREADY_EXISTS");
        }
        const serviceRequest = new serviceRequest_1.default(Object.assign(Object.assign({}, req.body), { toUser: service.user, fromUser: req.userId }));
        yield serviceRequest.save();
        res.status(204).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.createServiceRequest = createServiceRequest;
const updateServiceRequestStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const { status } = req.body;
        const serviceRequest = yield serviceRequest_1.default.findOne({
            _id: req.params.requestId,
            toUser: req.userId,
        });
        if (!serviceRequest) {
            throw new customError_1.http404Error("REQUEST_NOT_FOUND");
        }
        if (serviceRequest.status !== "pending") {
            throw new customError_1.http422Error("REQUEST_ALREADY_PROCESSED");
        }
        if (status === "accepted") {
            const service = yield service_1.default.findOneAndUpdate({
                _id: serviceRequest.service,
                spotsAvailable: { $gt: 0 },
            }, { $inc: { spotsAvailable: -1 } }, { returnDocument: "after" });
            if (!service) {
                throw new customError_1.http422Error("NO_SPOTS_AVAILABLE");
            }
        }
        serviceRequest.status = status;
        yield serviceRequest.save();
        res.status(200).json({ serviceRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.updateServiceRequestStatus = updateServiceRequestStatus;
