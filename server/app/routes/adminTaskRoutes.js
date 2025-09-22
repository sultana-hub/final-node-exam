const express = require("express");
const AdminTaskController = require("../controller/AdminTaskController");
const EjsAuthCheck = require("../middleware/EjsAuthCheck");
const requireRole = require("../middleware/roles");

const router = express.Router();

// // only TEACHER can manage timetable
router.get("/task-list", EjsAuthCheck, requireRole("SuperAdmin", "Admin", 'Manager','Employee'), AdminTaskController.getTasks);
router.get('/create-task', EjsAuthCheck, requireRole("SuperAdmin","Admin"), AdminTaskController.createTaskPage)
router.post('/create-task', EjsAuthCheck, requireRole("SuperAdmin","Admin"), AdminTaskController.createTask)

 router.get("/task/edit/:id",EjsAuthCheck, requireRole("SuperAdmin","Admin"),AdminTaskController.editTaskPage)
 router.put("/task/update/:id",EjsAuthCheck, requireRole("SuperAdmin","Admin"),AdminTaskController.updateTask)

router.delete("/delete/task/:id",EjsAuthCheck, requireRole("SuperAdmin","Admin"),AdminTaskController.deleteTask)

router.get("/assign/task/:id",EjsAuthCheck, requireRole('Manager'),AdminTaskController.assignTaskPage)
router.patch("/assign/task/:id",EjsAuthCheck, requireRole('Manager'),AdminTaskController.assignTask)

// Employee-only 
  router.patch("/emp-editStatus/:id", EjsAuthCheck, requireRole("Employee"), AdminTaskController.updateTaskStatus);

module.exports = router;