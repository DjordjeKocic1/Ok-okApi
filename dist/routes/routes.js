"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../utils/validation");
const customError_1 = require("../utils/customError");
const serviceController_1 = require("../controllers/serviceController");
const serviceRequestController_1 = require("../controllers/serviceRequestController");
require("dotenv").config();
const router = express_1.default.Router();
//Auth Routes
router.post("/auth/create-account", validation_1.validateEmail, validation_1.validateDuplicateEmail, validation_1.validatePassword, userController_1.createUser);
router.post("/auth/login", validation_1.validateEmail, validation_1.validateEmailExist, userController_1.userLogin);
router.get("/user/:userId", validation_1.validateUserExist, userController_1.getUser);
//Service Routes
router.post("/create-service/:userId", validation_1.validateUserExist, serviceController_1.createService);
router.get("/services/:locationStart/:locationEnd", serviceController_1.getServicesByLocation);
router.get("/services/:userId", validation_1.validateUserExist, serviceController_1.getUserServices);
//Service Request Routes
router.post("/create-service-request", serviceRequestController_1.createServiceRequest);
//404
router.all("/{*splat}", (req, res, next) => {
    throw new customError_1.http404Error(`Requested url not found`);
});
exports.default = router;
