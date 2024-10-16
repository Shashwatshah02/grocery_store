const express = require("express");
const categoryController = require("../controller/categoryController.js");
const customerController = require("../controller/customerController.js");
const orderController = require("../controller/orderController.js");
const productController = require("../controller/productController.js");
const { db } = require('../db.js');

const router = express.Router();



// app.use(
//     session({
//         secret: "your-secret-key", // Replace with your own secret key
//         resave: false, // Don't save session if it hasn't been modified
//         saveUninitialized: false, // Don't create session until something is stored
//         cookie: { maxAge: 60000 }, // Session expiration time (optional, 60 seconds in this example)
//     })
// );

// PRODUCT ROUTES
router.get('/product/', productController.getAllProductsAdmin);
router.post('/product/', productController.createProductsAdmin);
router.post('/product/update/:id', productController.updateProductAdmin);
router.get('/product/update/:id', productController.getProductByIdAdmin);
router.get('/product/delete/:id', productController.deleteProductByIdAdmin);
router.get('/product/variations/', productController.getAllVariationsAdmin);
router.post('/product/variations/', productController.createVariationsAdmin);
router.post('/product/variations/update/:id', productController.updateVariationAdmin);
router.get('/product/variations/update/:id', productController.getVariationByIdAdmin);
router.get('/product/variations/delete/:id', productController.deleteVariationByIdAdmin);


// CATEGORY ROUTES
router.get("/categories/", categoryController.getAllCategoriesAdmin);
router.post("/categories/create", categoryController.addCategoriesAdmin);
router.get("/categories/create", (req, res) => {
    res.render("theme/category-create", { title: "Create Category" });
});
router.get("/categories/delete/:id", categoryController.deleteCategorybyIdAdmin);


// CUSTOMER ROUTES
router.get('/customer/', customerController.getAllCustomersAdmin);
// router.get('/:id', customerController.getCustomerById);
// router.post('customer/', customerController.createCustomerAdmin);
router.post('/customer/create', customerController.createCompleteCustomerAdmin);
router.post('/customer/forgotpassword', customerController.forgotPasswordAdmin);
router.post('/customer/login', customerController.loginCustomerAdmin);
router.get("/customer/edit/:id", customerController.getProfileAdmin);
router.post('/customer/update/:id', customerController.updateProfileAdmin);
// router.put('/:id', customerController.updateCustomer);
router.get('/customer/delete/:id', customerController.deleteCustomerAdmin);
router.get("/customer/create", (req, res) => {
    res.render("theme/user-create", { title: "User Registration" });
});


// ORDER ROUTES
router.get('/order/', orderController.getAllOrdersAdmin);
router.post('/order/', orderController.createOrdersAdmin);
router.post('/order/update/:id', orderController.updateOrderAdmin);
router.get('/order/update/:id', orderController.getOrderByIdAdmin);
router.get('/order/delete/:id', orderController.deleteOrderByIdAdmin);

// LOGIN ROUTES
router.route("/login")
    .get((req, res) => {
        res.render("login", { title: "Login", layout: false });
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log(username, password);
            // Check if username and password are not undefined
            if (!username || !password) {
                return res
                    .status(400)
                    .render("login", { error: "Username and password are required" });
            }

            const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);

            if (!user || !user.length) {
                // Username not found
                return res
                    .status(400)
                    .render("login", { error: "Username does not exist" });
            }

            // Check if the password matches
            if (user[0].password === password) {
                req.session.isLoggedIn = true; // Set session variable
                req.session.user = { username };
                return res.redirect("/admin/customer"); // Redirect to admin page

            } else {
                // Password is incorrect
                return res.status(401).render("login", { error: "Incorrect password" });
            }
        } catch (error) {
            // Handle any server-side errors
            return res.status(500).json({ error: error.message });
        }
    });

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
        } else {
            res.redirect('admin/login'); // Redirect to login page after logging out
        }
    });
});



module.exports = router;

