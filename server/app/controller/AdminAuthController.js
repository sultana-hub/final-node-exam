
const { UserModel, roles, loginSchema, validateSchema } = require('../model/user')
const httpStatusCode = require('../helper/httpStatusCode')
const bcrypt = require('bcryptjs');
const { hashedPassword, comparePassword } = require('../middleware/hashPasswors')
// const { sendUserCredentials } = require('../utils/sendUserCredential')
const fs = require('fs');
const path = require('path')
const jwt = require('jsonwebtoken');


class AdminController {


    async registerpage(req, res) {

        try {
            const message = req.flash('message')
            res.render('register', {
                title: "Register",
                message
            });
        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
            res.redirect('/');
        }

    }


    async register(req, res) {
        try {
            console.log("BODY RECEIVED:", req.body);

            const usersData = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,  // plain password kept temporarily
                role: req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase(),
                image: req.file ? req.file.path : null
            };

            const { error, value } = validateSchema.validate(usersData);
            if (error) {

                return res.status(httpStatusCode.Unauthorized).json({
                    message: error.details[0].message,
                });
            }

            const isExist = await UserModel.findOne({ email: value.email });
            if (isExist) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "User already exists",
                });
            }

            // Hash password before saving
            value.password = await hashedPassword(value.password);

            const user = await UserModel.create(value);

            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "4h" }
            );

            return res.status(httpStatusCode.Create).json({
                message: "User created successfully.",
                data: user,
                token: token
            });
        } catch (error) {
            res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message,
            });
        }
    }


    async loginpage(req, res) {
        try {
            const message = req.flash('message');
            res.render('login', {
                title: "Login",
                message
            });
        } catch (error) {
            console.error(error);
            req.flash('message', "Internal server error");
            res.redirect('/');
        }
    }


    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                req.flash('message', error.details[0].message);
                return res.redirect('/');
            }

            const user = await UserModel.findOne({ email: value.email });
            if (!user) {
                req.flash('message', "User not found");
                return res.redirect('/');
            }
            if (!user.isActive) {
                req.flash("message", "Your account has been deactivated. Contact Super Admin.");
                return res.redirect('/')
            }
            const isMatch = await comparePassword(value.password, user.password);
            if (!isMatch) {
                req.flash('message', "Invalid password");
                return res.redirect('/');
            }

            //  Access Token (short expiry)
            const accessToken = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15m" } // short lived
            );

            //  Refresh Token (longer expiry)
            const refreshToken = jwt.sign(
                { _id: user._id, email: user.email, role: user.role },
                process.env.REFRESH_SECRET_KEY, // use a different secret
                { expiresIn: "7d" } // valid for 7 days
            );

            //  Save refresh token in DB (optional: helps revoke tokens later)
            user.refreshTokens = refreshToken;
            await user.save();

            //  Set cookies
            res.cookie("usertoken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            req.flash("message", "Welcome To Dashboard!");
            return res.redirect("/dashboard");

        } catch (err) {
            console.error(" Login error:", err);
            req.flash("message", "Internal server error");
            return res.redirect("/");
        }
    }

    // refreshtoken

    async refreshToken(req, res) {
        try {
            const token = req.cookies.refreshtoken || req.body.refreshToken;
            if (!token) {
                return res.status(401).json({ message: "Refresh token missing" });
            }

            //  Verify refresh token
            jwt.verify(token, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid or expired refresh token" });
                }

                //  Check if refresh token exists in DB
                const user = await UserModel.findOne({ _id: decoded._id, refreshTokens: token });
                if (!user) {
                    return res.status(403).json({ message: "Refresh token not found in DB" });
                }

                if (!user.isActive) {
                    req.flash("message", "Your account has been deactivated. Contact Super Admin.");
                    return res.redirect('/')
                }
                //  Generate new access token
                const newAccessToken = jwt.sign(
                    {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "15m" }
                );

                //  Optionally, rotate refresh token for security (recommended)
                const newRefreshToken = jwt.sign(
                    { _id: user._id, email: user.email, role: user.role },
                    process.env.REFRESH_SECRET_KEY,
                    { expiresIn: "7d" }
                );

                user.refreshTokens = newRefreshToken;
                await user.save();

                //  Send tokens (cookie + response body)
                res.cookie("usertoken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });

                res.cookie("refreshtoken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });

                // return res.json({
                //     accessToken: newAccessToken,
                //     refreshToken: newRefreshToken,
                // });
                req.flash("message", "Welcome To Dashboard!");
                return res.redirect("/dashboard");
            });
        } catch (error) {
            console.error("Refresh token error:", error);
            return res.status(500).json({ message: "Server error while refreshing token" });
        }
    }

    // log out

    async logout(req, res) {
        try {
            // 1. Clear JWT cookies
            res.clearCookie("usertoken");
            res.clearCookie("refreshtoken");

            // 2. Remove refresh token from DB
            if (req.user?._id) {
                await UserModel.findByIdAndUpdate(req.user._id, {
                    $unset: { refreshTokens: "" } // remove refreshTokens field
                });
            }

            // 3. Destroy session if you’re using express-session
            req.session.destroy(() => {
                return res.redirect("/?message=Logged out successfully");
            });

        } catch (error) {
            console.error("Logout error:", error);
            return res.redirect("/?error=Something went wrong");
        }
    }

    //dashboard
    async dashboard(req, res) {
        try {
            //Logged-in user comes from JWT (middleware attached req.user)
            const loggedInUser = req.user;

            //  Use flash for dynamic message
            req.flash("success", `Welcome to ${loggedInUser.role} dashboard`);

            res.render("dashboard", {
                title: `${loggedInUser.role} Dashboard`,
                user: loggedInUser,   // only logged-in user
                message: req.flash("success"),
            });
        } catch (error) {
            console.error("Dashboard error:", error);
            req.flash("error", "Failed to load dashboard");
            return res.redirect("/");
        }
    }


    async getAllUsers(req, res) {
        try {
            // Fetch all users except the currently logged-in admin
            const users = await UserModel.find({ _id: { $ne: req.user._id } });

            // Flash message, if any
            const message = req.flash('message');

            // Render the user list page
            res.render('users/list', {
                title: "Manage Users",
                users,
                message,
                user: req.user, // currently logged-in user
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            req.flash('message', "Failed to load users");
            res.redirect('/admin/dashboard');
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            // ✅ Allow only Super Admin not needed 
            // if (!req.user || req.user.role !== "SuperAdmin") {
            //     req.flash("message", "Access denied. Only Super Admin can delete users.");
            //     return res.redirect("/user-list");
            // }
            // Prevent admin from deleting themselves
            if (userId === req.user._id.toString()) {
                req.flash('message', "You cannot delete yourself!");
                return res.redirect('/user-list');
            }

            const deletedUser = await UserModel.findByIdAndDelete(userId);

            if (!deletedUser) {
                req.flash('message', "User not found");
                return res.redirect('/user-list');
            }

            req.flash('message', "User deleted successfully");
            res.redirect('/user-list');
        } catch (error) {
            console.error("Error deleting user:", error);
            req.flash('message', "Failed to delete user");
            res.redirect('/user-list');
        }
    }

    // toggle user status deactivate or activate 

    async toggleUserStatus(req, res) {
        try {
            if (req.user.role !== "SuperAdmin") {
                req.flash("message", "Only Super Admin can update user status.");
                return res.redirect("/user-list");
            }

            const userId = req.params.id;
            const user = await UserModel.findById(userId);

            if (!user) {
                req.flash("message", "User not found");
                return res.redirect("/user-list");
            }

            // Toggle status
            user.isActive = !user.isActive;
            await user.save();

            req.flash("message", `User ${user.isActive ? "activated" : "deactivated"} successfully`);
            return res.redirect("/user-list");
        } catch (error) {
            console.error("Error updating user status:", error);
            req.flash("message", "Failed to update user status");
            return res.redirect("/user-list");
        }
    }


    async getAllEmployee(req, res) {
        try {
            const emp = await UserModel.aggregate([
                {
                    $match: {
                        "role": "Employee"
                    }
                },
                {
                    $project: {
                        name: 1
                    }
                }

            ])
            if (emp.length === 0) {
                console.log("Employee not found")
                return res.redirect('/task/list')
            }
            return res.status(200).json({ status: true, data: emp });
        } catch (error) {
            console.log("Error in getting Employee", error.message)
            return res.redirect('/task/list')
        }
    }








}

module.exports = new AdminController