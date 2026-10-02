import { RequestHandler } from "express";
import ServiceRequest from "../model/serviceRequest";
import { ServiceRequest as ServiceRequestProps } from "../types/type";
import { validationResult } from "express-validator";
import { http422Error } from "../utils/customError";

export const createServiceRequest: RequestHandler<
  {},
  {},
  ServiceRequestProps
> = async (req, res, next) => {
  try {
    const serviceRequest = new ServiceRequest(req.body);

    await serviceRequest.save();

    res.status(201).send("success");
  } catch (error) {
    next(error);
  }
};
