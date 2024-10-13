import express from "express";
import orderController from "../controller/orderController.js";

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrders);
router.put('/update/:id', orderController.updateOrder);
router.get('/update/:id', orderController.getOrderById);
router.delete('/delete/:id', orderController.deleteOrderById);



export default router;