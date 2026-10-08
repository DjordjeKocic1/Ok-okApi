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
exports.cancelService = exports.getUserServices = exports.getServicesByLocation = exports.updateServiceStatus = exports.updateService = exports.createService = void 0;
const service_1 = __importDefault(require("../model/service"));
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = new service_1.default(Object.assign(Object.assign({}, req.body), { user: req.userId }));
        yield service.save();
        res.status(204).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.createService = createService;
const updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const { tripNote, destinationStart, destinationEnd, departureTime, cost, maxWeight, restrictedItems, spotsAvailable, transportMode, } = req.body;
        const service = yield service_1.default.findOneAndUpdate({ _id: req.params.serviceId, user: req.userId }, {
            tripNote,
            destinationStart,
            destinationEnd,
            departureTime,
            cost,
            maxWeight,
            restrictedItems,
            spotsAvailable,
            transportMode,
        }, {
            returnDocument: "after",
            runValidators: true,
        });
        if (!service) {
            throw new customError_1.http404Error("SERVICE_NOT_FOUND");
        }
        res.status(200).json({ service });
    }
    catch (error) {
        next(error);
    }
});
exports.updateService = updateService;
const updateServiceStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = yield service_1.default.findOneAndUpdate({ _id: req.params.serviceId, user: req.userId, status: "active" }, { status: req.body.status }, { returnDocument: "after", runValidators: true });
        if (!service) {
            throw new customError_1.http422Error("CANNOT_CHANGE_STATUS");
        }
        res.status(200).json({ service });
    }
    catch (error) {
        next(error);
    }
});
exports.updateServiceStatus = updateServiceStatus;
const getServicesByLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield service_1.default.find({
            status: "active",
            departureTime: { $gt: new Date() },
        }).populate({
            path: "user",
            select: "firstName lastName ratingSum ratingCount",
        });
        const filtered = services.filter((s) => s.destinationStart.city.toLowerCase() ===
            req.params.locationStart.toLowerCase() &&
            s.destinationEnd.city.toLowerCase() ===
                req.params.locationEnd.toLowerCase());
        res.status(201).json({ services: filtered });
    }
    catch (error) {
        next(error);
    }
});
exports.getServicesByLocation = getServicesByLocation;
const getUserServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const services = yield service_1.default.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .populate({
            path: "requests",
            populate: {
                path: "fromUser",
                select: "firstName lastName",
            },
        });
        res.status(200).json({ services });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserServices = getUserServices;
const cancelService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = yield service_1.default.findOneAndUpdate({
            _id: req.params.serviceId,
            user: req.userId,
            status: "active",
        }, { status: "cancelled" }, { returnDocument: "after" });
        if (!service) {
            throw new customError_1.http404Error("SERVICE_NOT_FOUND");
        }
        yield serviceRequest_1.default.updateMany({ service: service._id, status: { $in: ["pending", "accepted"] } }, { status: "cancelled" });
        res.status(204).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.cancelService = cancelService;
