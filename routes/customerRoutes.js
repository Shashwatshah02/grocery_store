const express = require("express");
const customerController = require("../controller/customerController.js");

const router = express.Router();    

router.get('/', customerController.getAllCustomers);
// router.get('/:id', customerController.getCustomerById);
router.post('/create', customerController.createCustomer);
router.put('/forgotpassword', customerController.forgotPassword);
router.post('/login', customerController.loginCustomer);
router.get("/edit/:id", customerController.getProfile);
router.post('/update/:id', customerController.updateProfile);
// router.put('/:id', customerController.updateCustomer);
router.get('/delete/:id', customerController.deleteCustomer);


module.exports = router;