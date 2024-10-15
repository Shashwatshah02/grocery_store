const express = require("express");
const categoryController = require("../controller/categoryController.js");
const { verifyToken } = require("../middleware/jwt.js");


const router = express.Router();

router.get("/", verifyToken, categoryController.getAllCategories);
router.post("/", verifyToken, categoryController.addCategories);
router.get("/delete/:id", verifyToken, categoryController.deleteCategorybyId);


module.exports = router;