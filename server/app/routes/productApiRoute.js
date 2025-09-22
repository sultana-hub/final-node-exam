const express=require("express")
const ProductApiController=require("../controller/frontEnd/ProductController")
const router=express.Router()




router.get("/products",ProductApiController.Productlist)
router.get("/product/single/:id",ProductApiController.singleProduct)
router.get("/product/search",ProductApiController.searchProducts.bind(ProductApiController))
module.exports=router