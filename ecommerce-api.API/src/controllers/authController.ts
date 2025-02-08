import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { JWT_SECRET } from "../config/db";
import { validateUser } from "../validations/userValidation";
import { IUser } from "../interface/userInterface";
import mongoose from "mongoose";

class AuthController {
  // User Registration Handler
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Step 1: Validate user input
      const { error, value: payload } = validateUser(req.body);
      if (error) {
        res.status(400).json({
          message: error.details.map((err) => err.message),
        });
        return; // Ensure execution stops here
      }

      const { email, password } = payload;

      // Step 2: Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return; // Ensure execution stops here
      }

      // Step 3: Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Step 4: Create new user data
      const userData: IUser = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
        password: hashedPassword,
      };

      // Step 5: Save the user in the database
      const newUser = new User(userData);
      const savedUser = await newUser.save();

      // Step 6: Generate JWT token
      const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, {
        expiresIn: "10m",
      });

      // Step 7: Respond with the new user data
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: savedUser._id,
          email: savedUser.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error during registration", error });
    }
  }

  // User Login Handler
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Step 1: Verify if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Step 2: Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Step 3: Generate access and refresh tokens
      const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "10m",
      });
      const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });

      // Step 4: Send the response
      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login", error });
    }
  }

  // Refresh Token Handler
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
      }

      // Step 1: Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };

      // Step 2: Find the user by ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Step 3: Generate new tokens
      const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "5m",
      });
      const newRefreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });

      // Step 4: Respond with the new tokens
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Refresh token expired" });
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }
      res.status(500).json({ message: "Error during token refresh", error });
    }
  }
}

export default new AuthController();
