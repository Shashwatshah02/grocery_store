const express = require("express");
const customerController = require("../controller/customerController.js");
const { verifyToken } = require("../middleware/jwt.js");

const router = express.Router();

router.get('/', verifyToken, customerController.getAllCustomers);
// router.get('/:id', customerController.getCustomerById);
router.post('/', verifyToken, customerController.createCustomer);
router.post('/create', verifyToken, customerController.createCompleteCustomer);
router.post('/forgotpassword', verifyToken, customerController.forgotPassword);
router.post('/login', verifyToken, customerController.loginCustomer);
router.get("/edit/:id", verifyToken, customerController.getProfile);
router.post('/update/:id', verifyToken, customerController.updateProfile);
// router.put('/:id', customerController.updateCustomer);
router.get('/delete/:id', verifyToken, customerController.deleteCustomer);



module.exports = router;