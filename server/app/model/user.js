const mongoose = require('mongoose')

const schema = mongoose.Schema
const Joi = require('joi')
const roles = ["Admin", "Manager", "Employee", "SuperAdmin"];
const validateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    password: Joi.string().required().min(4),
    role: Joi.string().valid(...roles).required(),
    image:Joi.string().optional().trim()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});



const UserSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true

    },
    role: {
        type: String,
        enum: roles,
        default: "Employee"
    },
    image:{
        type:String,
        default:"Image"
    },
    // Store valid refresh tokens (rotation; supports multi-device)
    refreshTokens: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

const UserModel = mongoose.model('user', UserSchema)

module.exports = { UserModel, roles, loginSchema, validateSchema }