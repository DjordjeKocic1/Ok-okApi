import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "NO_TOKEN" });
  }

  try {
    const payload = jwt.verify(
      header.split(" ")[1],
      process.env.SESSION_SECRET as string,
    ) as { userId: string };

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: "INVALID_TOKEN" });
  }
};
