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
const auth_1 = require("../middleware/auth");
require("dotenv").config();
const router = express_1.default.Router();
//Auth Routes
router.post("/auth/create-account", validation_1.validateEmail, validation_1.validateDuplicateEmail, validation_1.validatePassword, userController_1.createUser);
router.post("/auth/login", validation_1.validateEmail, validation_1.validateEmailExist, userController_1.userLogin);
//User routes
router.get("/user", auth_1.auth, validation_1.validateAuthUser, userController_1.getUser);
//Service Routes
router.get("/services", auth_1.auth, validation_1.validateAuthUser, serviceController_1.getUserServices);
router.get("/services/:locationStart/:locationEnd", serviceController_1.getServicesByLocation);
router.post("/create-service", auth_1.auth, validation_1.validateAuthUser, serviceController_1.createService);
router.put("/services/:serviceId", auth_1.auth, validation_1.validateServiceExist, serviceController_1.updateService);
//Service Request Routes
router.post("/create-service-request", auth_1.auth, validation_1.validateBodyServiceExist, serviceRequestController_1.createServiceRequest);
//404
router.all("/{*splat}", (req, res, next) => {
    throw new customError_1.http404Error(`Requested url not found`);
});
exports.default = router;
