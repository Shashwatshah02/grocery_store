const express = require("express");
const customerController = require("../controller/customerController.js");

const router = express.Router();

router.get('/', customerController.getAllCustomers);
// router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.post('/create', customerController.createCompleteCustomer);
router.put('/forgotpassword', customerController.forgotPassword);
router.post('/login', customerController.loginCustomer);
router.get("/edit/:id", customerController.getProfile);
router.post('/update/:id', customerController.updateProfile);
// router.put('/:id', customerController.updateCustomer);
router.get('/delete/:id', customerController.deleteCustomer);
router.get("/create", (req, res) => {
    res.render("theme/user-create", { title: "User Registration" });
});


module.exports = router;