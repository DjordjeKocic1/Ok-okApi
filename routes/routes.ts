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
} from "../utils/validation";
import { http404Error } from "../utils/customError";
import {
  createService,
  getUserServices,
  getServicesByLocation,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { createServiceRequest } from "../controllers/serviceRequestController";
import { auth } from "../middleware/auth";

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
router.post("/create-service", auth, validateAuthUser, createService);
router.put("/services/:serviceId", auth, validateServiceExist, updateService);
router.delete(
  "/services/:serviceId",
  auth,
  validateServiceExist,
  deleteService,
);

//Service Request Routes
router.post(
  "/create-service-request",
  auth,
  validateBodyServiceExist,
  createServiceRequest,
);
//404
router.all("/{*splat}", (req, res, next) => {
  throw new http404Error(`Requested url not found`);
});

export default router;
