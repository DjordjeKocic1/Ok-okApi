import express from "express";
import { createUser, getUser, userLogin } from "../controllers/userController";
import {
  validateEmail,
  validateDuplicateEmail,
  validatePassword,
  validateEmailExist,
  validateAuthUser,
  validateServiceExist,
  validateBodyServiceExist,
  validateServiceRequestExist,
} from "../utils/validation";
import { http404Error } from "../utils/customError";
import {
  createService,
  getUserServices,
  getServicesByLocation,
  updateService,
  cancelService,
  updateServiceStatus,
} from "../controllers/serviceController";
import {
  createServiceRequest,
  updateServiceRequestStatus,
} from "../controllers/serviceRequestController";
import { auth } from "../middleware/auth";
import { rateUser } from "../controllers/reviewController";

require("dotenv").config();

const router = express.Router();

//Auth Routes
router.post(
  "/auth/create-account",
  validateEmail,
  validateDuplicateEmail,
  validatePassword,
  createUser,
);
router.post("/auth/login", validateEmail, validateEmailExist, userLogin);

//User routes
router.get("/user", auth, validateAuthUser, getUser);

//Service Routes
router.get("/services", auth, validateAuthUser, getUserServices);
router.get("/services/:locationStart/:locationEnd", getServicesByLocation);
router.post("/services/create", auth, validateAuthUser, createService);
router.put("/services/:serviceId", auth, validateServiceExist, updateService);
router.put(
  "/services/:serviceId/status",
  auth,
  validateServiceExist,
  updateServiceStatus,
);
router.put(
  "/services/:serviceId/cancel",
  auth,
  validateServiceExist,
  cancelService,
);

//Service Request Routes
router.post(
  "/service-request/create",
  auth,
  validateBodyServiceExist,
  createServiceRequest,
);
router.put(
  "/service-request/:requestId/status",
  auth,
  validateServiceRequestExist,
  updateServiceRequestStatus,
);

// Review routes
router.post(
  "/rate-user/:requestId",
  auth,
  validateServiceRequestExist,
  rateUser,
);

//404
router.all("/{*splat}", (req, res, next) => {
  throw new http404Error(`Requested url not found`);
});

export default router;
