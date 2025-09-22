
const httpStatusCode = require("../helper/httpStatusCode");
const { CategoryModel, categoryValidation } = require("../model/category");
const fs = require('fs').promises
const path = require('path')
const slugify = require('slugify')
class CategoryController {

    async createCategory(req, res) {
        try {
            console.log("BODY RECEIVED:", req.body);

            const categoryData = {
                name: req.body.name,
            };

            // Validate using Joi
            const { error, value } = categoryValidation.validate(categoryData);

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    message: error.details[0].message,
                });
            }

            const { name } = value;

            // Create new category
            const category = new CategoryModel({ name });
            await category.save();
            req.flash('message', 'Category created successfully!');
            // Redirect with success message
            return res.redirect('/category/list');

        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Server error while creating category",
            });
        }
    }


    async updateCategory(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        try {
            if (!name || name.trim() === "") {
                console.log("name required");
                return res.redirect(`/category/${id}/edit`);
            }

            const existingCategory = await CategoryModel.findOne({ name, _id: { $ne: id } });
            if (existingCategory) {
                console.log("name already exists");
                return res.redirect(`/category/${id}/edit`);
            }

            const category = await CategoryModel.findByIdAndUpdate(
                id,
                {
                    name,
                    slug: slugify(name, { lower: true, strict: true }),
                },
                { new: true, runValidators: true }
            );

            if (!category) {
                console.log("category not found");
                return res.redirect('/category/list');
            }

            console.log("Category updated successfully");
            res.redirect('/category/list');
        } catch (error) {
            console.error("Update error:", error.message);
            res.redirect(`/category/${id}/edit`);
        }
    }


    async deleteCategory(req, res) {
        try {
            const id = req.params.id
            const delCat = await CategoryModel.findByIdAndDelete(id)
            if (!delCat) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Cat data not found"
                })

            }
            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: "Data deleted successfully"
            // })
            return res.redirect('/category/list');
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }


    }


}


module.exports = new CategoryController()