import express from "express";
import customerController from "../controller/customerController.js";

const router = express.Router();    

router.get('/', customerController.getAllCustomers);
// router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/forgotpassword', customerController.forgotPassword);
router.get('/login', customerController.loginCustomer);
// router.put('/:id', customerController.updateCustomer);
// router.delete('/:id', customerController.deleteCustomer);


export default router;