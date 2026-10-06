import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { http422Error } from "../utils/customError";
import Review from "../model/review";
import ServiceRequest from "../model/serviceRequest";
import { Review as ReviewProps, Service as ServiceProps } from "../types/type";
import User from "../model/user";
import Service from "../model/service";

export const rateUser: RequestHandler<
  { requestId: string },
  {},
  ReviewProps
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const request = await ServiceRequest.findOne({
      _id: req.params.requestId,
      status: "accepted",
    });

    if (!request) throw new http422Error("REQUEST_NOT_FOUND");

    if (request.fromUser.toString() !== req.userId)
      throw new http422Error("CANT_REVIEW_YOURSELF");

    const service = await Service.findById(request.service);

    if (!service || service.status !== "completed")
      throw new http422Error("SERVICE_NOT_COMPLETED");

    const alreadyReviewed = await Review.exists({
      fromUser: req.userId,
      request: request._id,
    });

    if (alreadyReviewed) throw new http422Error("REVIEW_ALREADY_EXISTS");

    const review = new Review({
      fromUser: req.userId,
      toUser: request.toUser,
      request: request._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();

    await User.findByIdAndUpdate(request.toUser, {
      $inc: { ratingSum: req.body.rating, ratingCount: 1 },
    });

    const requestToUpdate = await ServiceRequest.findOneAndUpdate(
      {
        _id: req.params.requestId,
        rated: false,
        status: "accepted",
        fromUser: req.userId,
      },
      { rated: true },
    );
    if (!requestToUpdate)
      throw new http422Error("REQUEST_NOT_FOUND_OR_ALREADY_RATED");

    res.status(201).json({ message: "REVIEW_CREATED" });
  } catch (error) {
    next(error);
  }
};
