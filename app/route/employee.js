const express = require("express");
const { validation } = require("../constant/validate");
const adminAuth = require("../middleware/adminAuth");
const { create_employee, update_employee, get_all_employees, get_employee, delete_employee, change_password, employee_login, forgot_password, get_employee_salary_history, get_employee_bonus, create_dummy_data, save_profile_picture } = require("../controller/employee");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (!fs.existsSync(path.join(__dirname,'../public'))) {
            fs.mkdirSync(path.join(__dirname,'../public'));
        }
        
            if (!fs.existsSync(path.join(__dirname,'../public/profile-picture'))) {
            fs.mkdirSync(path.join(__dirname,'../public/profile-picture'));
        }

        cb(null, `${__dirname}/../public/profile-picture`);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${v4()}.${ext}`);
    }
});

const upload = multer({ storage });

router.post("/create_employee", create_employee);
router.put("/update_employee/:id", update_employee);
router.get("/view_all_employees", get_all_employees);
router.get("/view_employee/:id", get_employee);
router.delete("/delete_employee/:id", delete_employee); 
router.post("/change_password/:id", change_password);
router.post("/login", employee_login);
router.post("/forgot_password", forgot_password);
router.get("/salary_history/:employeeId", get_employee_salary_history);
router.get("/bonus/:employeeId", get_employee_bonus);
router.post("/dummy_entry", create_dummy_data);
router.post("/profile_picture/:employeeId", upload.single("file"), save_profile_picture);

module.exports = router;