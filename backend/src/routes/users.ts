import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// /api/users/register
router.post(
  "/register",
  [
    check("firstName", "Imię jest wymagane").isString(),
    check("lastName", "Nazwisko jest wymagane").isString(),
    check("email", "Email jest wymagany").isEmail(),
    check("password", "Hasło z przynajmniej 6 znaków jest wymagane").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email, //checking if the email in database matches the email in the body of the request
      });

      if (user) {
        return res
          .status(400)
          .json({ message: "Konto z tym adresem email już istnieje." });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      // return res.sendStatus(200);
      return res.status(200).send({ message: "Konto utworzone pomyślnie." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Coś poszło nie tak." });
    }
  }
);

export default router;
