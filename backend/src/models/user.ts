import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = { //this will help us make sure that we have all the correct fields -> intellisense and typescript (checking the types of input values)
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

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