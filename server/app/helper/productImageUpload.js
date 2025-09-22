const multer = require('multer')
const path = require('path')
const fs = require('fs')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const ProductImageupload = multer({ storage: storage })

//handling both multiple and single images 
// const productImageFields = ProductImageupload.fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'productImages', maxCount: 4 }
// ]);

module.exports = ProductImageupload 