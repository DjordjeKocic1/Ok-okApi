import { RequestHandler } from "express";
import User from "../model/user";
import { http422Error } from "../utils/customError";
import jwt from "jsonwebtoken";
import bcryprt from "bcryptjs";
import { User as UserProps } from "../types/type";
import { body, validationResult } from "express-validator";
import { passwordRegex } from "../utils/constants";

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

    const password = req.body.password;

    if (!password) {
      throw new http422Error("Password is required");
    }

    if (!passwordRegex.test(password)) {
      throw new http422Error("Password too weak");
    }

    const cryptedPassword = await bcryprt.hash(password.replace(" ", ""), 12);

    const user = new User({
      email: req.body.email,
      password: cryptedPassword,
    });

    const userCreate = await user.save();
    return res.status(201).json({ user: userCreate });
  } catch (error) {
    next(error);
  }
};
