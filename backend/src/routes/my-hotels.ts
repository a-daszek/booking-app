import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

// api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Dodaj nazwę hotelu."),
    body("city").notEmpty().withMessage("Dodaj miasto."),
    body("country").notEmpty().withMessage("Dodaj kraj."),
    body("description").notEmpty().withMessage("Dodaj opis hotelu."),
    body("type").notEmpty().withMessage("Dodaj typ hotelu."),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Dodaj cenę za noc."),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Dodaj udogodnienia dostępne w hotelu."),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1. Uploading the images to the cloudinary service
      const uploadPromises = imageFiles.map(async (image) => {
        //adding a map to run a logic to upload each individual image to cloud
        //encoding the image as a base 64 string so it can be processed by cloudinary
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
        //this code is iterating over the image files array that we get from imageFiles req., then it's encoding the image and creating a string that describes the image
        //next it's using the cloudinary sdk to upload the image to our cloudinary account, if that goes well, we'll get a url back and return it
        //it's asynchronous so all will execute at the same time
      });

      //2. Adding the URLs to the new hotel

      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //3. Saving the new hotel in a database

      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Wystąpił błąd przy dodawaniu hotelu: ", error);
      res.status(500).json({ message: "Coś poszło nie tak." });
    }
  }
);
export default router;
