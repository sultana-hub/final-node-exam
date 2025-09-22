const httpStatusCode = require('../helper/httpStatusCode')
const { ProductModel } = require('../model/productApiModel')
const { CategoryModel } = require('../model/category')


class AdminController {
    async dashboard(req, res) {
        try {
            const category = await CategoryModel.find()
            const product = await ProductModel.find()

            // Set a flash message if none exists yet
            if (!req.flash('success').length) {
                req.flash('success', 'Welcome to Dashboard!');
            }

            res.render('dashboard', {
                title: "dashboard",
                category,
                product,
                success_msg: req.flash('success'),
            })

        } catch (error) {
            console.log(error.message);

        }

    }
    //product admin
    async listProductPage(req, res) {
        try {
            const product = await ProductModel.find({ isDeleted: false })
            // Set a flash message if none exists yet
            if (!req.flash('success').length) {
                req.flash('success', 'Welcome to Products List!');
            }
            res.render('product/list', {
                title: "product List",
                product,
                success_msg: req.flash('success'),

            })
        } catch (error) {
            console.log("errorr in showing product list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }
    async addProductPage(req, res) {
        try {
            const message = req.flash('message');
            const category = await CategoryModel.find()
            res.render('product/add', { title: "Add product", category, message })
        } catch (error) {
            console.log("errorr in creating product list", error)
            req.flash('message', "Error in creating product");
        }
    }



    async editProductPage(req, res) {
        try {
            const product = await ProductModel.findById(req.params.id);
            const category = await CategoryModel.find()
            res.render('product/edit', { title: "Edit Course", product, category })
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }

    //category admin
    async listCategoryPage(req, res) {
        try {
            const category = await CategoryModel.find()
            if (!req.flash('success').length) {
                req.flash('success', 'Welcome to Category List!');
            }
            res.render('category/list', {
                title: "category List", category,
                success_msg: req.flash('success'),
            })
        } catch (error) {
            console.log("errorr in showing category list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }
    async addCategoryPage(req, res) {
        try {
            const message = req.flash('message');
            res.render('category/add', { title: "Add category", message })
        } catch (errorr) {
            res.status(httpStatusCode.InternalServerError).send(errorr)
            req.flash('message', "Error in creating category");
        }
    }



    async editCategory(req, res) {
        try {
            const category = await CategoryModel.findById(req.params.id);
            res.render('category/edit', { title: "Edit category", category })
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }

}

module.exports = new AdminController