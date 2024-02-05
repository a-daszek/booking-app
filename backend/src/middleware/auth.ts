import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global { //with that we get rid of the error in line 21 (userId)
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try { //decoding the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);//checking if the token we got was created by us and not someone else by decoding it 
    //with a key that was created by us and used to create the token
    req.userId = (decoded as JwtPayload).userId;//whenever express forwards on the requests, to our own handler in auth.ts, so the validate-token endpoint, 
    //it means that we're able to get access to it and send it back to the frontend
    next();//letting express do the next thing taht it was going to, which is forwarding the request onto our validate-token endpoint
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;