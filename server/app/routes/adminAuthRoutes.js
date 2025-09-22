const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminAuthController");
const EjsAuthCheck = require("../middleware/EjsAuthCheck");
const requireRole = require("../middleware/roles");

// login + register pages
router.get("/", AdminController.loginpage);
router.post("/login", AdminController.login);

router.post("/refresh", AdminController.refreshToken);

router.get('/logout',AdminController.logout)

router.get('/register', AdminController.registerpage)
router.post('/register', AdminController.register)

// dashboard (any logged-in user can see)
router.get("/dashboard", EjsAuthCheck, AdminController.dashboard);

// // SuperAdmin can access user list
 router.get("/user-list", EjsAuthCheck, requireRole('SuperAdmin'), AdminController.getAllUsers);
 router.delete("/delete", EjsAuthCheck, requireRole("SuperAdmin"),AdminController.deleteUser)
router.post('/users/activate/:id',EjsAuthCheck,requireRole('SuperAdmin'),AdminController.toggleUserStatus)
router.post('/users/deactivate/:id',EjsAuthCheck,requireRole('SuperAdmin'),AdminController.toggleUserStatus)





module.exports = router;
