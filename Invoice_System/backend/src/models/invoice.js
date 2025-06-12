import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    amount: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    // invoiceNumber: { type: Number, required: true, unique: true },
    invoiceNumber: { type: Number, unique: true },
    date: { type: Date, required: true, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [itemSchema],
    totalAmount: { type: Number, required: true },
    remarks: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
        typeCast: true
    }
);

// Auto-increment invoice number
invoiceSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const lastInvoice = await this.constructor.findOne().sort({ invoiceNumber: -1 });
    this.invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1000;
    next();
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

export default invoiceModel;
