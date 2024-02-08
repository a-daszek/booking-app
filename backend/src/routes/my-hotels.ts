import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
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
      const imageUrls = await uploadImages(imageFiles);

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

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Coś poszło nie tak." });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Wystąpił błąd przy pobieraniu danych o hotelach." });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      //get the string fields from the body
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();
      //get the hotel that we're updating by it's id
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        }, //and save the updated details to it
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Nie znaleziono hotelu." });
      }

      const files = req.files as Express.Multer.File[]; //any new files that the user decided to add

      const updatedImageUrls = await uploadImages(files); //this will upload the new images to cloudinary and give us back the urls as arrays of strings

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ]; //making a copy and spreading it into new array because we want to add the existing imageurls to this array as well

      await hotel.save();

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Coś poszło nie tak." });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
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
  return imageUrls;
}

export default router;
