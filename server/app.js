
const express = require("express")
const ejs = require("ejs")
const dbCon = require('./app/config/dbCon')
const cors = require("cors")
const methodOverride = require('method-override');
const path = require('path')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')


const app = express()
// Fix CSP here
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'self' data: blob:;");
    next();
});

app.set("view engine", "ejs")
app.set("views", "views")



dbCon()
app.use(cors())
app.use(express.json())
//middleware
app.use(express.urlencoded({ extended: true }))

//method override
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//routes front end
const ProductApiRoute=require('./app/routes/productApiRoute')
app.use('/api',ProductApiRoute)

//admin route
const adminRoute = require('./app/routes/adminRoute')
app.use( adminRoute)
const port = 3000

app.listen(port, () => {
    console.log("server running at port :", port)
})