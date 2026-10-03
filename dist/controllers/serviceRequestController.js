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
exports.createServiceRequest = void 0;
const serviceRequest_1 = __importDefault(require("../model/serviceRequest"));
const express_validator_1 = require("express-validator");
const customError_1 = require("../utils/customError");
const service_1 = __importDefault(require("../model/service"));
const createServiceRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new customError_1.http422Error(errors.array()[0].msg);
        }
        const service = (yield service_1.default.findById(req.body.service));
        const serviceRequest = new serviceRequest_1.default(Object.assign(Object.assign({}, req.body), { toUser: service.user, fromUser: req.userId }));
        yield serviceRequest.save();
        res.status(201).send("success");
    }
    catch (error) {
        next(error);
    }
});
exports.createServiceRequest = createServiceRequest;
