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
    res.status(201).send("success");
  } catch (error) {
    next(error);
  }
};

export const updateService: RequestHandler<
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
      { _id: req.params.serviceId, user: req.userId },
      req.body,
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

export const getServicesByLocation: RequestHandler<
  { locationStart: string; locationEnd: string },
  {},
  {}
> = async (req, res, next) => {
  try {
    const services = await Service.find({
      status: "active",
      departureTime: { $gt: new Date() },
    }).populate("user", "firstName lastName review");
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
        populate: { path: "fromUser", select: "firstName lastName ratings" },
      });
    res.status(200).json({ services });
  } catch (error) {
    next(error);
  }
};

export const deleteService: RequestHandler<
  { serviceId: string },
  {},
  {}
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const service = await Service.findOneAndDelete({
      _id: req.params.serviceId,
      user: req.userId,
    });

    if (!service) {
      throw new http404Error("SERVICE_NOT_FOUND");
    }

    await ServiceRequest.deleteMany({ service: service._id });

    res.status(204).send("success");
  } catch (error) {
    next(error);
  }
};
