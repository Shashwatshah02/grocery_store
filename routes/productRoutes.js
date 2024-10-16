const express = require("express");
const productController = require("../controller/productController.js");
const { verifyToken } = require("../middleware/jwt.js");


const router = express.Router();

router.get('/', verifyToken, productController.getAllProducts);
router.post('/', verifyToken, productController.createProducts);
router.post('/update/:id', verifyToken, productController.updateProduct);
router.get('/update/:id', verifyToken, productController.getProductById);
router.get('/category/:id', verifyToken, productController.getProductByCategoryId);
router.get('/delete/:id', verifyToken, productController.deleteProductById);
router.get('/variations/', verifyToken, productController.getAllVariations);
router.post('/variations/', verifyToken, productController.createVariations);
router.post('/variations/update/:id', verifyToken, productController.updateVariation);
router.get('/variations/update/:id', verifyToken, productController.getVariationByProductId);
router.get('/variations/delete/:id', verifyToken, productController.deleteVariationById);


module.exports = router;