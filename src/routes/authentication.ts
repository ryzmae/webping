import express, { Router, Request, Response, NextFunction } from "express";
import { validate } from "email-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

import { Logger } from "../utils/Logger";
import { UserModel } from "../schemas/UserSchema";
import { secret } from "../utils/Util";

const logger: any = new Logger({
  info: true,
  error: true,
  warn: true,
  debug: true,
});

const router: Router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!validate(email)) {
      return res.status(400).json({ message: "Invalid email" });
    } else if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    } else if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters long" });
    } else if (name.length > 20) {
      return res
        .status(400)
        .json({ message: "Name must be less than 20 characters long" });
    }

    try {
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();

      res.status(201).json({ message: "User created" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    try {
      const user = await UserModel.findOne({ name });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token: string = jwt.sign({ name }, secret, { expiresIn: "1h" });

      res.status(200).json({ message: "Successfully logged in!", token });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
