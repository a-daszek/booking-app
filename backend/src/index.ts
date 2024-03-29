import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; //loading the environment variables when the app starts
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelsRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

app.use(express.static(path.join(__dirname, "../../frontend/dist"))); //

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response) => {
  //pass on any requests to our url that are not API endpoints and to let the
  //react router dom package handle the routing of this req for us. Doint this because some of the routes are behind conditional logic and
  //won't be part of the static files
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// app.get("/api/test", async (req: Request, res: Response) => {
//   res.json({ message: "Hello from express" });
// });

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
