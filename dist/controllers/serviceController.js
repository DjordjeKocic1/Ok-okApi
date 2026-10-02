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
exports.getUserServices = exports.getServicesByLocation = exports.createService = void 0;
const service_1 = __importDefault(require("../model/service"));
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = new service_1.default(Object.assign(Object.assign({}, req.body), { user: req.params.userId }));
        yield service.save();
        res.status(201).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.createService = createService;
const getServicesByLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield service_1.default.find().populate("user", "firstName lastName ratings");
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
        const services = yield service_1.default.find({ user: req.params.userId }).populate("requests");
        res.status(201).json({ services });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserServices = getUserServices;
