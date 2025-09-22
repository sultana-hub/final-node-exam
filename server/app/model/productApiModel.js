
const mongoose = require('mongoose');
const slugify = require('slugify');

const Joi = require("joi")

const productValidation = Joi.object({
    name: Joi.string().required().min(3),
    category: Joi.string().required().min(3),
    description: Joi.string().required().min(10),
    image: Joi.string().required(),

})

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true
    });

// Auto-generate slug before saving
ProductSchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});
const ProductModel = mongoose.model("product", ProductSchema)
module.exports = { ProductModel, productValidation };




