const mongoose = require('mongoose')

const schema = mongoose.Schema

const Joi = require("joi");

const taskValidationSchema = Joi.object({
    title: Joi.string().trim().min(3).required(),
    description: Joi.string().trim().min(5).required(),
    priority: Joi.string()
        .valid("High", "Medium", "Low")
        .required(),
    status: Joi.string()
        .valid("Pending", "In Progress", "Completed")
        .optional(),
    assignedBy: Joi.string().hex().length(24).optional(),
    assignedTo: Joi.string().hex().length(24).optional(),
    dueDate: Joi.date().greater("now").optional(), // must be a future date
});

const TaskSchema = new schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default:"Pending",
            required: true
        },   // Manager ID
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
          
        },// link to employee
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        
        },
        dueDate: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
)

const TaskModel = mongoose.model('task', TaskSchema)

module.exports = { TaskModel, taskValidationSchema }