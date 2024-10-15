const express = require("express");
const orderController = require("../controller/orderController.js");
const { verifyToken } = require("../middleware/jwt.js");

const router = express.Router();

router.get('/', verifyToken, orderController.getAllOrders);
router.post('/', verifyToken, orderController.createOrders);
router.post('/update/:id', verifyToken, orderController.updateOrder);
router.get('/update/:id', verifyToken, orderController.getOrderById);
router.get('/delete/:id', verifyToken, orderController.deleteOrderById);



module.exports = router;