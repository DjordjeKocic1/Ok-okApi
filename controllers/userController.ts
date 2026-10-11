import { RequestHandler } from "express";
import User from "../model/user";
import { http422Error } from "../utils/customError";
import jwt from "jsonwebtoken";
import bcryprt from "bcryptjs";
import { User as UserProps } from "../types/type";
import { validationResult } from "express-validator";
import Service from "../model/service";
import ServiceRequest from "../model/serviceRequest";
import Review from "../model/review";

export const createUser: RequestHandler<{}, {}, UserProps> = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const cryptedPassword = await bcryprt.hash(
      req.body.password.replace(" ", ""),
      12,
    );

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: cryptedPassword,
    });

    await user.save();
    res.status(201).send("success");
  } catch (error) {
    next(error);
  }
};

export const userLogin: RequestHandler<{}, {}, UserProps> = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const userFind = (await User.findOne({
      email: req.body.email,
    })) as UserProps;

    const passwordCompare = await bcryprt.compare(
      req.body.password.replace(" ", ""),
      userFind.password,
    );

    if (!passwordCompare) {
      throw new http422Error("WRONG_PASSWORD");
    }

    const token = jwt.sign(
      { userId: userFind._id },
      process.env.SESSION_SECRET as string,
      { expiresIn: "90d" },
    );

    res.status(200).json({
      user: {
        email: userFind.email,
        firstName: userFind.firstName,
        lastName: userFind.lastName,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const user = (await User.findById(req.userId).select(
      "-password",
    )) as UserProps;

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler<{}, {}, UserProps> = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const { firstName, lastName, phone, searchedDestinations } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        phone,
        searchedDestinations,
      },
      { returnDocument: "after", runValidators: true },
    ).select("-password");

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword: RequestHandler<
  {},
  {},
  { password: string; newPassword: string }
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    const { password, newPassword } = req.body;

    const user = (await User.findById(req.userId))!;

    const matchsCurrentPassword = await bcryprt.compare(
      password.replace(" ", ""),
      user.password,
    );

    if (!matchsCurrentPassword) throw new http422Error("WRONG_PASSWORD");

    const samePassword = await bcryprt.compare(
      newPassword.replace(" ", ""),
      user.password,
    );

    if (samePassword) throw new http422Error("NEW_PASSWORD_SAME_AS_OLD");

    user.password = await bcryprt.hash(newPassword.replace(" ", ""), 12);

    await user.save();

    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }

    await Service.deleteMany({ user: req.userId });

    await ServiceRequest.deleteMany({ fromUser: req.userId });

    await Review.deleteMany({ toUser: req.userId });

    await Review.updateMany(
      { fromUser: req.userId },
      { $set: { fromUser: null } },
      { overwriteImmutable: true },
    );

    await User.findOneAndDelete({ _id: req.userId });

    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
