const express=require("express")
const AdminController=require("../controller/AdminController")
const productImageUploads=require('../helper/productImageUpload')
const ProductController=require('../controller/productApiController')
const CategoryController=require('../controller/CategoryController')
const router=express.Router()


// router.post("/register",UsersImageUploads.single('image'),AuthController.register)
router.get("/",AdminController.dashboard)
//product admin route
router.get('/product/list', AdminController.listProductPage)

router.get('/product/add',AdminController.addProductPage)
router.post('/product/create',productImageUploads.single('image'), ProductController.createProduct)

router.get('/product/:id/edit', AdminController.editProductPage)
router.put('/product/update/:id',productImageUploads.single('image'), ProductController.updateProduct)

router.delete('/product/delete/:id',ProductController.softDelete)
//category admin route
router.get('/category/list', AdminController.listCategoryPage)

router.post('/category/create', CategoryController.createCategory)

router.get('/category/add', AdminController.addCategoryPage)

router.get('/category/:id/edit', AdminController.editCategory)
router.put('/category/update/:id', CategoryController.updateCategory)

router.delete('/category/delete/:id',CategoryController.deleteCategory)
module.exports=router