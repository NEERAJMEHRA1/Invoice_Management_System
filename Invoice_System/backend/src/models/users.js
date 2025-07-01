import mongoose from "mongoose";
const Schema = mongoose.Schema;


//User schema/model
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    companyName: { type: String, default: "", },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    phone: { type: String, default: "" },
    logo: { type: String, default: "" },
},
    {
        timestamps: true,
        typeCast: true
    }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
