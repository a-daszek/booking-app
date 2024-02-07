import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email jest wymagany").isEmail(),
    check(
      "password",
      "Hasło składające sie z co najmniej 6 znaków jest wymagane"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body; //getting hold of the pass and email

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Użytkownik nie istnieje." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Użytkownik nie istnieje." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Coś poszło nie tak." });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  //whenever we make a request to the validate-token endpoint,
  //it's going to run some middleware, that will check the HTTP cookie that was sent to us by the frontend in the request,
  //depending on if that check (verifyToken) passes or not-if it does, the middleware will forward the request onto this function
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

export default router;