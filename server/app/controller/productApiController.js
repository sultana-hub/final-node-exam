
const httpStatusCode = require("../helper/httpStatusCode")
const { ProductModel, productValidation } = require("../model/productApiModel")
const fs = require("fs")
const slugify = require('slugify')

class ProducApiController {



    async createProduct(req, res) {
        try {
            const prodData = {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category
            };

            // Main image
            if (req.file) {
                prodData.image = req.file.path;
            }

            // Validate with Joi
            const validatedData = await productValidation.validateAsync(prodData);

            // Save product
            const createdProduct = await ProductModel.create(validatedData);

            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     data: createdProduct
            // });
             req.flash('message', 'Product created successfully!');
            return res.redirect('/product/list');

        } catch (error) {
            console.error(error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.details?.[0]?.message || error.message || 'Server error'
            });
        }
    }



    //get all products

    async Productlist(req, res) {
        try {

            const totalProduct = await ProductModel.find({ isDeleted: false });

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Get all products successfully",
                data: totalProduct,

            });
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }

    //for get single data
    async singleProduct(req, res) {
        try {
            const id = req.params.id

            const single = await ProductModel.findById(id)

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "get single data",
                data: single
            })

        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }
    }

    //update single data

    async updateProduct(req, res) {
        try {
            const { id } = req.params;

            // Check if product exists
            const existingProduct = await ProductModel.findById(id);
            if (!existingProduct) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: 'Product not found',
                });
            }

            // Extract data from request
            const updatedData = {
                name: req.body.name || existingProduct.name,
                description: req.body.description || existingProduct.description,
                category: req.body.category || existingProduct.category,
                image: req?.file.path?.replace(/\\/g, '/') || existingProduct.image
            };


            const { error } = productValidation.validate({
                name: updatedData.name,
                category: updatedData.category,
                description: updatedData.description,
                image: updatedData.image,

            });

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message
                });
            }

            // Generate slug if name changed
            if (updatedData.name !== existingProduct.name) {
                updatedData.slug = slugify(updatedData.name, { lower: true, strict: true });
            }

            // Update the product
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            );

            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: 'Product updated successfully',
            //     data: updatedProduct,
            // });
            return res.redirect('/product/list');

        } catch (error) {
            console.error(error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: 'Something went wrong',
                error: error.message,
            });
        }
    };




    // delete product
    async deleteProduct(req, res) {
        try {
            const id = req.params.id
            const delProduct = await ProductModel.findByIdAndDelete(id)
            if (!delProduct) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Product data not found"
                })

            }
            // return res.status(errorCode.Success).json({
            //     status: true,
            //     message: "Data deleted successfully"
            // })

            return res.redirect('/product/list');
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }


    }



    //soft delete
    async softDelete(req, res) {
        try {
            const id = req.params.id
            const softDel = await ProductModel.findByIdAndUpdate(id, {
                isDeleted: true,
            })

            // res.redirect('/api/dashboard')
            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: "Deleted successfully",
            //     data: softDel
            // })
             return res.redirect('/product/list');
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
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
                    { slug: searchRegex }
                ]
            });

            // return res.render('dashboard', {
            //     data,
            //     keyword,
            //     message: data.length ? null : 'No matching products found',
            //      user: req.user
            // });

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

module.exports = new ProducApiController