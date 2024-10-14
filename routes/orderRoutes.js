const express = require("express");
const orderController = require("../controller/orderController.js");

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrders);
router.put('/update/:id', orderController.updateOrder);
router.get('/update/:id', orderController.getOrderById);
router.delete('/delete/:id', orderController.deleteOrderById);



module.exports = router;