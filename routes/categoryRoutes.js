import express from "express";
import categoryController from "../controller/categoryController.js";

const router = express.Router();    

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.addCategories);
router.get("/delete/:id", categoryController.deleteCategorybyId);


export default router;