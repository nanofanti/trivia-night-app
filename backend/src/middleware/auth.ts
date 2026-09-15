import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      message: "JWT configuration missing.",
    });
  }

  try {
    jwt.verify(token, jwtSecret);

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authenticateAdmin;
