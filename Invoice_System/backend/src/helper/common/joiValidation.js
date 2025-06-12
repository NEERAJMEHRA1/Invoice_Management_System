import Joi from 'joi';

// Invoice validation schemas
const itemSchema = Joi.object({
    description: Joi.string().required(),
    rate: Joi.number().required().positive(),
    quantity: Joi.number().required().positive().integer(),
    discount: Joi.number().min(0)
});

const invoiceSchema = Joi.object({
    language: Joi.string().optional().default('en'),
    customerId: Joi.string().required(),
    items: Joi.array().items(itemSchema).min(1).required(),
    remarks: Joi.string().allow('')
});

const updateInvoiceSchema = Joi.object({
    invoiceId: Joi.string().required(),
    language: Joi.string().optional().default('en'),
    customerId: Joi.string().required(),
    items: Joi.array().items(itemSchema).min(1).required(),
    remarks: Joi.string().allow('')
});

export const validateInvoice = (data) => invoiceSchema.validate(data);
export const updateValidateInvoice = (data) => updateInvoiceSchema.validate(data);
