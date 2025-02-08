// Import required dependencies from express and jsonwebtoken
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/db";

// Define the structure of JWT payload
interface JwtPayload {
  userId: string;
}

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    // Format: "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];

    // If no token is provided, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify the token using JWT_SECRET and cast the result to JwtPayload type
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Add the userId from the decoded token to the request object
    // This makes the userId available to subsequent middleware and route handlers
    req.userId = decoded.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    res.status(401).json({ message: "Invalid token" });
  }
};

