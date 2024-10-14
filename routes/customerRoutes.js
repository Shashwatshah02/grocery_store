import express from "express";
import customerController from "../controller/customerController.js";

const router = express.Router();    

router.get('/', customerController.getAllCustomers);
// router.get('/:id', customerController.getCustomerById);
router.post('/create', customerController.createCustomer);
router.put('/forgotpassword', customerController.forgotPassword);
router.post('/login', customerController.loginCustomer);
router.get("/edit/:id", customerController.getProfile);
router.post('/update/:id', customerController.updateProfile);
// router.put('/:id', customerController.updateCustomer);
router.delete('/delete/:id', customerController.deleteCustomer);


export default router;