const express = require("express");
const categoryController = require("../controller/categoryController.js");


const router = express.Router();    

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategories);
router.get("/delete/:id", categoryController.deleteCategorybyId);


module.exports = router;