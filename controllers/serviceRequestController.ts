import { RequestHandler } from "express";
import ServiceRequest from "../model/serviceRequest";
import {
  Service as ServiceProps,
  ServiceRequest as ServiceRequestProps,
} from "../types/type";
import { validationResult } from "express-validator";
import { http422Error } from "../utils/customError";
import Service from "../model/service";

export const createServiceRequest: RequestHandler<
  {},
  {},
  ServiceRequestProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const service = (await Service.findById(req.body.service)) as ServiceProps;

    const serviceRequest = new ServiceRequest({
      ...req.body,
      toUser: service.user,
      fromUser: req.userId,
    });

    await serviceRequest.save();

    res.status(201).send("success");
  } catch (error) {
    next(error);
  }
};
