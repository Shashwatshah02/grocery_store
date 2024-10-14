const express = require("express");
const productController = require("../controller/productController.js");


const router = express.Router();    

router.get('/', productController.getAllProducts);
router.post('/', productController.createProducts);
router.put('/update/:id', productController.updateProduct);
router.get('/update/:id', productController.getProductById);
router.delete('/delete/:id', productController.deleteProductById);
router.get('/variations/', productController.getAllVariations);
router.post('/variations/', productController.createVariations);
router.put('/variations/update/:id', productController.updateVariation);
router.get('/variations/update/:id', productController.getVariationById);
router.delete('/variations/delete/:id', productController.deleteVariationById);


module.exports = router;