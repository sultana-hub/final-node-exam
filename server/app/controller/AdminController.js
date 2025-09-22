const httpStatusCode = require('../helper/httpStatusCode')
const {ProductModel} = require('../model/productApiModel')
const CategoryModel = require('../model/category')


class AdminController {
    async dashboard(req, res) {
        try {

            res.render('dashboard', {
                title: "dashboard"
            })

        } catch (error) {
            console.log(error.message);

        }

    }
    //product admin
    async listProductPage(req, res) {
       try {
            const product = await ProductModel.find({ isDeleted: false })

            res.render('product/list', {
                title: "product List", product

            })
        } catch (error) {
            console.log("errorr in showing product list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }
    async addProductPage(req, res) {
        try {
            const category=await CategoryModel.find()
            res.render('product/add', { title: "Add product" ,category})
        } catch (errorr) {
            res.status(httpStatusCode.InternalServerError).send(errorr)
        }
    }



    async editProductPage(req, res) {
        try {
            const product = await ProductModel.findById(req.params.id);
             const category=await CategoryModel.find()
            res.render('product/edit', { title: "Edit Course", product,category })
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }

    //category admin
    async listCategoryPage(req, res) {
        try {
            const category = await CategoryModel.find()

            res.render('category/list', {
                title: "category List", category,

            })
        } catch (error) {
            console.log("errorr in showing category list", error)
            res.status(httpStatusCode.InternalServerError).send(error)
        }
    }
    async addCategoryPage(req, res) {
        try {
            res.render('category/add', { title: "Add category" })
        } catch (errorr) {
            res.status(httpStatusCode.InternalServerError).send(errorr)
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