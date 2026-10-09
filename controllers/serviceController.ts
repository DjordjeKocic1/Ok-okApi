import { RequestHandler } from "express";
import Service from "../model/service";
import ServiceRequest from "../model/serviceRequest";
import { Service as ServiceProps } from "../types/type";
import { validationResult } from "express-validator";
import { http404Error, http422Error } from "../utils/customError";

export const createService: RequestHandler<{}, {}, ServiceProps> = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const service = new Service({
      ...req.body,
      user: req.userId,
    });
    await service.save();
    res.status(204).send("success");
  } catch (error) {
    next(error);
  }
};

export const updateService: RequestHandler<
  { serviceId: string },
  {},
  ServiceProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const {
      tripNote,
      destinationStart,
      destinationEnd,
      departureTime,
      cost,
      maxWeight,
      restrictedItems,
      spotsAvailable,
      transportMode,
    } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, user: req.userId, status: "active" },
      {
        tripNote,
        destinationStart,
        destinationEnd,
        departureTime,
        cost,
        maxWeight,
        restrictedItems,
        spotsAvailable,
        transportMode,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    if (!service) {
      throw new http404Error("SERVICE_NOT_FOUND");
    }

    res.status(200).json({ service });
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatus: RequestHandler<
  { serviceId: string },
  {},
  ServiceProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, user: req.userId, status: "active" },
      { status: req.body.status },
      { returnDocument: "after", runValidators: true },
    );

    if (!service) {
      throw new http422Error("CANNOT_CHANGE_STATUS");
    }

    res.status(200).json({ service });
  } catch (error) {
    next(error);
  }
};

export const getServicesByLocation: RequestHandler<
  { locationStart: string; locationEnd: string },
  {},
  {}
> = async (req, res, next) => {
  try {
    const services = await Service.find({
      status: "active",
      departureTime: { $gt: new Date() },
    }).populate({
      path: "user",
      select: "firstName lastName ratingSum ratingCount",
    });
    const filtered = services.filter(
      (s) =>
        s.destinationStart.city.toLowerCase() ===
          req.params.locationStart.toLowerCase() &&
        s.destinationEnd.city.toLowerCase() ===
          req.params.locationEnd.toLowerCase(),
    );
    res.status(201).json({ services: filtered });
  } catch (error) {
    next(error);
  }
};

export const getUserServices: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const services = await Service.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "requests",
        populate: {
          path: "fromUser",
          select: "firstName lastName",
        },
      });
    res.status(200).json({ services });
  } catch (error) {
    next(error);
  }
};

export const cancelService: RequestHandler<
  { serviceId: string },
  {},
  {}
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.serviceId,
        user: req.userId,
        status: "active",
      },
      { status: "cancelled" },
      { returnDocument: "after" },
    );

    if (!service) {
      throw new http404Error("SERVICE_NOT_FOUND");
    }

    await ServiceRequest.updateMany(
      { service: service._id, status: { $in: ["pending", "accepted"] } },
      { status: "cancelled" },
    );

    res.status(204).send("success");
  } catch (error) {
    next(error);
  }
};
