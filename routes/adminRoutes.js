const express = require("express");
const categoryController = require("../controller/categoryController.js");
const customerController = require("../controller/customerController.js");
const orderController = require("../controller/orderController.js");
const productController = require("../controller/productController.js");
const { db } = require('../db.js');
const  isAuthenticated  = require('../middleware/userAuth.js');

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
router.get('/product/', isAuthenticated, productController.getAllProductsAdmin);
router.post('/product/create', isAuthenticated, productController.createProductsAdmin);
router.post('/product/update/:id', isAuthenticated, productController.updateProductAdmin);
router.get('/product/edit/:id', isAuthenticated, productController.getProductByIdAdmin);
router.get('/product/delete/:id', isAuthenticated, productController.deleteProductByIdAdmin);
router.get('/product/variations/', isAuthenticated, productController.getAllVariationsAdmin);
router.post('/product/variations/', isAuthenticated, productController.createVariationsAdmin);
router.post('/product/variations/update/:id', isAuthenticated, productController.updateVariationAdmin);
router.get('/product/variations/update/:id', isAuthenticated, productController.getVariationByIdAdmin);
router.get('/product/variations/delete/:id', isAuthenticated, productController.deleteVariationByIdAdmin);
router.get("/product/create", isAuthenticated, async (req, res) => {
    try {
        // Call the getAllCategoriesAdmin function to get the categories
        const categories = await categoryController.getProductCategories();

        // Log the fetched categories to the console (for debugging purposes)
        console.log(categories);

        // Render the product creation page with the fetched categories
        res.render("theme/product-create", { title: "Create Product", categories});
    } catch (error) {
        // Log and handle any errors
        console.error("Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
});



// CATEGORY ROUTES
router.get("/categories/", isAuthenticated, categoryController.getAllCategoriesAdmin);
router.post("/categories/create", isAuthenticated, categoryController.addCategoriesAdmin);
router.get("/categories/create", isAuthenticated, (req, res) => {
    res.render("theme/category-create", { title: "Create Category" });
});
router.get("/categories/delete/:id", isAuthenticated, categoryController.deleteCategorybyIdAdmin);


// CUSTOMER ROUTES
router.get('/customer/', isAuthenticated, customerController.getAllCustomersAdmin);
// router.get('/:id', customerController.getCustomerById);
// router.post('customer/', customerController.createCustomerAdmin);
router.post('/customer/create', isAuthenticated, customerController.createCompleteCustomerAdmin);
// router.post('/customer/forgotpassword', customerController.forgotPasswordAdmin);
// router.post('/customer/login', customerController.loginCustomerAdmin);
router.get("/customer/edit/:id", isAuthenticated, customerController.getProfileAdmin);
router.post('/customer/update/:id', isAuthenticated, customerController.updateProfileAdmin);
// router.put('/:id', customerController.updateCustomer);
router.get('/customer/delete/:id', isAuthenticated, customerController.deleteCustomerAdmin);
router.get("/customer/create", isAuthenticated, (req, res) => {
    res.render("theme/user-create", { title: "User Registration", errorMessage: null });
});


// ORDER ROUTES
router.get('/order/', isAuthenticated, orderController.getAllOrdersAdmin);
router.post('/order/', isAuthenticated, orderController.createOrdersAdmin);
router.get('/order/view/:id', isAuthenticated, orderController.viewInvoiceAdmin);
// router.post('/order/update/:id', orderController.updateOrderAdmin);
// router.get('/order/update/:id', orderController.getOrderByIdAdmin);
// router.get('/order/delete/:id', orderController.deleteOrderByIdAdmin);

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
                    .render("login", { error: "Username and password are required", layout: false });
            }

            const [user] = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);

            if (!user || !user.length) {
                // Username not found
                return res
                    .status(400)
                    .render("login", { error: "Username does not exist", layout: false });
            }

            // Check if the password matches
            if (user[0].password === password) {
                req.session.isLoggedIn = true; // Set session variable
                req.session.user = { username };
                console.log(req.session.user);
                console.log(req.session.isLoggedIn);
                return res.redirect("/admin/customer"); // Redirect to admin page

            } else {
                // Password is incorrect
                return res.status(401).render("login", { error: "Incorrect password", layout: false });
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
            res.redirect('/admin/login'); // Redirect to login page after logging out
        }
    });
});



module.exports = router;

