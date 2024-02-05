import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; //loading the environment variables when the app starts
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // our server is only going to accept requests from this url (origin), which we will define in our environments file,
    //and that URL must include the credentials (the http cookie) in the request
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));//

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// app.get("/api/test", async (req: Request, res: Response) => {
//   res.json({ message: "Hello from express" });
// });

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
