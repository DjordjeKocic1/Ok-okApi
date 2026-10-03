import { RequestHandler } from "express";
import User from "../model/user";
import { http404Error, http422Error } from "../utils/customError";
import jwt from "jsonwebtoken";
import bcryprt from "bcryptjs";
import { User as UserProps } from "../types/type";
import { validationResult } from "express-validator";

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
    const id = req.params.userId;

    if (!errors.isEmpty()) {
      throw new http422Error(errors.array()[0].msg);
    }
    const user = (await User.findById(req.userId)) as UserProps;

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
