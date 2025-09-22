
const httpStatusCode = require("../../helper/httpStatusCode")
const { ProductModel, productValidation } = require("../../model/productApiModel")
const fs = require("fs")


class ProducApiController {


    //get all products
    async Productlist(req, res) {
        try {
            const totalProduct = await ProductModel.find({ isDeleted: false })
                .populate('category'); //  this populates category details

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Get all products successfully",
                data: totalProduct,
            });
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message,
            });
        }
    }


   
    // Get single product by ID with populated category
    async singleProduct(req, res) {
        try {
            const id = req.params.id;

            const single = await ProductModel.findById(id)
                .populate('category'); //  Populate the category field

            if (!single) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Product not found",
                });
            }

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Get single product successfully",
                data: single,
            });

        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message,
            });
        }
    }


    async searchProducts(req, res) {
        try {
            const keyword = req.query.keyword?.trim();

            if (!keyword) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Keyword is required",
                });
            }

            const searchRegex = new RegExp(keyword, 'i');

            const data = await ProductModel.find({
                isDeleted: false,
                $or: [
                    { name: searchRegex },
                    { slug: searchRegex },
                    { description: searchRegex }
                ]
            }).populate('category', 'name slug'); 

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Search result fetched",
                total: data.length,
                data: data,
            });

        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }


}

module.exports = new ProducApiController()