import { RequestHandler } from "express";
import Service from "../model/service";
import { Service as ServiceProps } from "../types/type";
import { validationResult } from "express-validator";
import { http422Error } from "../utils/customError";

export const createService: RequestHandler<
  { userId: string },
  {},
  ServiceProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const service = new Service({
      ...req.body,
      user: req.params.userId,
    });
    await service.save();
    res.status(201).send("success");
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
    const services = await Service.find().populate(
      "user",
      "firstName lastName ratings",
    );
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

export const getUserServices: RequestHandler<
  { userId: string },
  {},
  {}
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const services = await Service.find({ user: req.params.userId }).populate(
      "requests",
    );
    res.status(201).json({ services });
  } catch (error) {
    next(error);
  }
};
