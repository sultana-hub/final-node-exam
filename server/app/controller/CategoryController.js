
const httpStatusCode = require("../helper/httpStatusCode");
const CategoryModel = require("../model/category");
const fs = require('fs').promises
const path = require('path')
const slugify=require('slugify')
class CategoryController {

    async createCategory(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "All fields are required"
                });
            }

            if (name.length < 3 || name.length > 30) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Name must be within 3 to 30 characters"
                });
            }

            //  Create a new instance of the CategoryModel
            const categoryData = new CategoryModel({ name });

            // Save the document instance
            const data = await categoryData.save();

            // return res.status(httpStatusCode.Create).json({
            //     status: true,
            //     message: "Category created successfully",
            //     data: data
            // });

             return res.redirect(`/category/list`);
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
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
            return res.status(httpStatusCode.Success).json({
                status: true,
                message: "Data deleted successfully"
            })
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }


    }


}


module.exports = new CategoryController()