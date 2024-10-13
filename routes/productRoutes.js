import express from "express";
import productController from "../controller/productController.js";

const router = express.Router();    

router.get('/', productController.getAllProducts);
router.post('/', productController.createProducts);
router.put('/update/:id', productController.updateProduct);
router.get('/update/:id', productController.getProductById);
router.delete('/delete/:id', productController.deleteProductById);


export default router;