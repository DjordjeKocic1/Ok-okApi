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
const reviewController_1 = require("../controllers/reviewController");
const chatController_1 = require("../controllers/chatController");
require("dotenv").config();
const router = express_1.default.Router();
//Auth Routes
router.post("/auth/create-account", validation_1.validateEmail, validation_1.validateDuplicateEmail, validation_1.validatePassword, userController_1.createUser);
router.post("/auth/login", validation_1.validateEmail, validation_1.validateEmailExist, userController_1.userLogin);
//User routes
router.get("/user", auth_1.auth, validation_1.validateAuthUser, userController_1.getUser);
router.put("/user", auth_1.auth, validation_1.validateAuthUser, userController_1.updateUser);
router.put("/user/password", auth_1.auth, validation_1.validateAuthUser, validation_1.validatePassword, validation_1.validateNewPassword, userController_1.updateUserPassword);
//Service Routes
router.get("/services", auth_1.auth, validation_1.validateAuthUser, serviceController_1.getUserServices);
router.get("/services/:locationStart/:locationEnd", auth_1.auth, serviceController_1.getServicesByLocation);
router.post("/services/create", auth_1.auth, validation_1.validateAuthUser, serviceController_1.createService);
router.put("/services/:serviceId", auth_1.auth, validation_1.validateServiceExist, serviceController_1.updateService);
router.put("/services/:serviceId/status", auth_1.auth, validation_1.validateServiceExist, serviceController_1.updateServiceStatus);
router.put("/services/:serviceId/cancel", auth_1.auth, validation_1.validateServiceExist, serviceController_1.cancelService);
//Service Request Routes
router.get("/service-requests", auth_1.auth, serviceRequestController_1.getServiceRequests);
router.post("/service-requests/create", auth_1.auth, validation_1.validateBodyServiceExist, serviceRequestController_1.createServiceRequest);
router.put("/service-requests/:requestId/update", auth_1.auth, validation_1.validateServiceRequestExist, serviceRequestController_1.updateServiceRequest);
router.put("/service-requests/:requestId/status", auth_1.auth, validation_1.validateServiceRequestExist, serviceRequestController_1.updateServiceRequestStatus);
// Review routes
router.post("/rate-user/:requestId", auth_1.auth, validation_1.validateServiceRequestExist, reviewController_1.rateUser);
//Chat routes
router.get("/chats", auth_1.auth, chatController_1.getChats);
router.get("/chat/:userId", auth_1.auth, chatController_1.getChat);
router.post("/chat/send-message/:userId", auth_1.auth, chatController_1.sendMessage);
//404
router.all("/{*splat}", (req, res, next) => {
    throw new customError_1.http404Error(`Requested url not found`);
});
exports.default = router;
