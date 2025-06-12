import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Customer schema/model
const customerSchema = new Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    creditLimit: { type: Number, default: 0 },
    creditUsed: { type: Number, default: 0 },
},
    {
        timestamps: true,
        typeCast: true
    }
);


const customerModel = mongoose.model("Customer", customerSchema);

export default customerModel;