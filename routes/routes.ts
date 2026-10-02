import express from "express";
import { createUser, getUser, userLogin } from "../controllers/userController";
import {
  validateEmail,
  validateDuplicateEmail,
  validatePassword,
  validateEmailExist,
  validateUserExist,
} from "../utils/validation";
import { http404Error } from "../utils/customError";
import {
  createService,
  getUserServices,
  getServicesByLocation,
} from "../controllers/serviceController";
import { createServiceRequest } from "../controllers/serviceRequestController";

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
router.get("/user/:userId", validateUserExist, getUser);

//Service Routes
router.post("/create-service/:userId", validateUserExist, createService);
router.get("/services/:locationStart/:locationEnd", getServicesByLocation);
router.get("/services/:userId", validateUserExist, getUserServices);

//Service Request Routes
router.post("/create-service-request", createServiceRequest);
//404
router.all("/{*splat}", (req, res, next) => {
  throw new http404Error(`Requested url not found`);
});

export default router;
