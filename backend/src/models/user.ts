import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";



const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

userSchema.pre("save", async function(next) {//middleware for mongodb - before the document is saved, it checks if the password has changed, if it did, we want bcrypt to hash it
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;