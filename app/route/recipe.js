const express = require("express");
const router = express.Router();
const recipeController = require("../controller/recipe");
const adminAuth = require("../middleware/adminAuth");
const { validation } = require("../constant/validate");

router.get(
    "/view/:id",
    adminAuth("Recipe:view_all"),
    recipeController.view
);
router.get(
    "/:businessId", 
    adminAuth("Recipe:view_all"),
    recipeController.getAllByBusiness
);
router.post(
    "/",
    adminAuth("Recipe:create"),
    validation("create_recipe"),
    recipeController.create
);
router.put(
    "/:id",
    adminAuth("Recipe:update"),
    validation("update_recipe"),
    recipeController.update
);
router.delete(
    "/:id",
    adminAuth("Recipe:delete"),
    recipeController.delete
);

module.exports = router;
