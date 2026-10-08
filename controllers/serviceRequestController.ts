import { RequestHandler } from "express";
import ServiceRequest from "../model/serviceRequest";
import {
  Service as ServiceProps,
  ServiceRequest as ServiceRequestProps,
} from "../types/type";
import { validationResult } from "express-validator";
import { http404Error, http422Error } from "../utils/customError";
import Service from "../model/service";

export const getServiceRequests: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const serviceRequest = await ServiceRequest.find({
      fromUser: req.userId,
    }).populate({
      path: "service",
      select:
        "status destinationStart destinationEnd departureTime transportMode spotsAvailable cost",
      populate: {
        path: "user",
        select: "firstName lastName ratingSum ratingCount",
      },
    });

    res.status(200).json({ serviceRequest });
  } catch (error) {
    next(error);
  }
};

export const updateServiceRequest: RequestHandler<
  { requestId: string },
  {},
  ServiceRequestProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const {
      transportDescription,
      packageWeight,
      specialRequest,
      specialRequestCost,
    } = req.body;

    const serviceRequest = await ServiceRequest.findOneAndUpdate(
      {
        _id: req.params.requestId,
        fromUser: req.userId,
        status: "pending",
      },
      {
        transportDescription,
        packageWeight,
        specialRequest,
        specialRequestCost,
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!serviceRequest) {
      throw new http404Error("REQUEST_NOT_FOUND");
    }

    res.status(200).json({ serviceRequest });
  } catch (error) {
    next(error);
  }
};

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

    if (service.spotsAvailable === 0) {
      throw new http422Error("NO_SPOTS_AVAILABLE");
    }

    if (service.user.toString() === req.userId) {
      throw new http422Error("CANNOT_REQUEST_OWN_SERVICE");
    }

    const alreadyRequested = await ServiceRequest.exists({
      service: service._id,
      fromUser: req.userId,
    });

    if (alreadyRequested) {
      throw new http422Error("REQUEST_ALREADY_EXISTS");
    }

    const serviceRequest = new ServiceRequest({
      ...req.body,
      toUser: service.user,
      fromUser: req.userId,
    });

    await serviceRequest.save();

    res.status(204).send("success");
  } catch (error) {
    next(error);
  }
};

export const updateServiceRequestStatus: RequestHandler<
  { requestId: string },
  {},
  { status: "accepted" | "rejected" }
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const { status } = req.body;

    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.requestId,
      toUser: req.userId,
    });

    if (!serviceRequest) {
      throw new http404Error("REQUEST_NOT_FOUND");
    }

    if (serviceRequest.status !== "pending") {
      throw new http422Error("REQUEST_ALREADY_PROCESSED");
    }

    if (status === "accepted") {
      const service = await Service.findOneAndUpdate(
        {
          _id: serviceRequest.service,
          spotsAvailable: { $gt: 0 },
        },
        { $inc: { spotsAvailable: -1 } },
        { returnDocument: "after" },
      );

      if (!service) {
        throw new http422Error("NO_SPOTS_AVAILABLE");
      }
    }

    serviceRequest.status = status;
    await serviceRequest.save();

    res.status(200).json({ serviceRequest });
  } catch (error) {
    next(error);
  }
};
