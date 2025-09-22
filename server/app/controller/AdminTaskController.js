const { TaskModel, taskValidationSchema } = require('../model/task');
const httpStatusCode = require('../helper/httpStatusCode')
const { UserModel, roles, loginSchema, validateSchema } = require('../model/user')
class AdminTaskController {

    async createTaskPage(req, res) {
        try {
            const message = req.flash('message', "Task created ");
            res.render('task/add', {
                title: "Task",
                message
            })
        } catch (error) {
            console.log("error in getting page ", error.message)
            req.flash('message', "Internal server error");
        }
    }


    async createTask(req, res) {
        try {
            console.log("BODY RECEIVED:", req.body);
            const taskData = {
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                dueDate: req.body.dueDate

            }

            const { error, value } = taskValidationSchema.validate(taskData)
            if (error) {

                return res.status(httpStatusCode.Unauthorized).json({
                    message: error.details[0].message,
                });
            }

            const { title, description, priority, dueDate } = value;

            const task = new TaskModel({
                title,
                description,
                priority,
                dueDate
            });

            await task.save();

            return res.redirect(
                "/task-list?message=Task entry created successfully"
            );
        } catch (error) {
            console.error("Error creating task:", error);
            return res.status(500).json({
                status: false,
                message: "Server error while creating task,Only Admin can create task",
            });
        }
    }

    // GET edit page
    async editTaskPage(req, res) {
        try {
            const task = await TaskModel.findById(req.params.id)
            if (!task) {
                return res.status(404).send("Task not found");
            }
            res.render("task/edit",
                {
                    task
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }

    async updateTask(req, res) {
        try {
            const taskId = req.params.id
            const taskData = {
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                dueDate: req.body.dueDate

            }
            const { error, value } = taskValidationSchema.validate(taskData)
            if (error) {
                console.log("Error in updating task", error.details[0].message)
                return res.redirect('/task-list')
            }

            const updatedTask = await TaskModel.findByIdAndUpdate(taskId, value, { new: true })
            return res.redirect('/task-list')


        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }

    }

    //get all task

    async getTasks(req, res) {
        try {
            let filter = {};

            if (req.user.role === "Employee") {
                filter = { assignedTo: req.user._id };
            }
            const entry = await TaskModel.find(filter)
                .populate("assignedBy", "name role")
                .populate("assignedTo", "name role")
                .lean();

            const message = req.flash("message");

            res.render("task/list", {
                title: "Task",
                message,
                entry,
                user: req.user
            });
        } catch (error) {
            console.error(error);
            req.flash("message", "Internal server error");
            res.redirect("/dashboard");
        }
    }
    async deleteTask(req, res) {
        try {
            const taskId = req.params.id;

            const taskDeleted = await TaskModel.findByIdAndDelete(taskId);

            if (!taskDeleted) {
                console.log("Task not found")
                return res.redirect('/task-list')

            }

            // return res.status(httpStatusCode.OK).json({
            //     status: true,
            //     message: "Task deleted successfully"
            // });
            console.log("Task deleted successfully")
            return res.redirect('/task-list')

        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }

    async assignTaskPage(req, res) {
        try {
            const taskId = req.params.id;

            const task = await TaskModel.findById(taskId);
            if (!task) {
                req.flash("message", "Task not found");
                return res.redirect("/task-list");
            }

            // Get all employees
            const employees = await UserModel.find({ role: "Employee" }, "name _id");

            // Logged in user = Manager (from auth middleware)
            const manager = req.user;

            res.render("task/assign", {
                task,
                employees,
                manager,
                message: req.flash("message"),
                user: req.user
            });
        } catch (error) {
            console.error("Error rendering assign form", error.message);
            req.flash("message", "Error loading assign form");
            return res.redirect("/task/list");
        }
    }

    // PATCh /assign/task/:id
    async assignTask(req, res) {
        try {
            const taskId = req.params.id;

            // logged-in manager info from auth middleware
            const managerId = req.user._id;
            const managerName = req.user.name;

            // employee id from the form select
            const employeeId = req.body.assignedTo;

            // update the task
            const updatedTask = await TaskModel.findByIdAndUpdate(
                taskId,
                {
                    $set: {
                        assignedBy: managerId,    // must be ObjectId
                        assignedTo: employeeId,   // must be ObjectId
                        status: "In Progress"     // update status
                    }
                },
                { new: true }
            );

            if (!updatedTask) {
                req.flash("message", "Task not found");
                return res.redirect("/task-list");
            }

            req.flash("message", "Task assigned successfully");
            return res.redirect("/task-list");

        } catch (error) {
            console.error("Error in assignTask:", error.message);
            req.flash("message", "Error assigning task");
            return res.redirect("/task-list");
        }
    }


   // PATCH /tasks/:id/status
async updateTaskStatus(req, res) {
  try {
    const taskId = req.params.id;
    const employeeId = req.user._id; // logged-in employee

    // only update status if task is assigned to this employee
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, assignedTo: employeeId },
      { status: req.body.status },  // partial update
      { new: true }
    );

    if (!updatedTask) {
      req.flash("message", "Task not found or not assigned to you");
      return res.redirect("/task-list");
    }

    req.flash("message", "Task status updated successfully");
    return res.redirect("/task-list");

  } catch (error) {
    console.error("Error updating task status:", error.message);
    req.flash("message", "Error updating status");
    return res.redirect("/task-list");
  }
}

}
module.exports = new AdminTaskController