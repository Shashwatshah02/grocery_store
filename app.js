const { getConnection, db } = require('./db.js');
const customerRoutes = require('./routes/customerRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const express = require("express");
const logger = require('./logger.js');
const path = require("path");
const session = require("express-session");
const jwt = require('jsonwebtoken');
const { fileURLToPath } = require("url");
const { verifyToken } = require('./middleware/jwt.js');
// const __filename = fileURLToPath(module.url);
// const __dirname = path.dirname(__filename);
const cors = require("cors");
const bodyParser = require("body-parser");
const Cart = require('./models/cartModel.js');
const env = require('dotenv').config();
const crypto = require('crypto');
const expressLayouts = require('express-ejs-layouts');


const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const app = express();
app.use(
    session({
        secret: "your-secret-key", // Replace with your own secret key
        resave: false, // Don't save session if it hasn't been modified
        saveUninitialized: false, // Don't create session until something is stored
        cookie: { maxAge: 1000000  }, // Session expiration time (optional, 60 seconds in this example)
    })
);



app.set('view engine', 'ejs');
app.set('views', './views');
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(expressLayouts);
app.use('/customer', customerRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);



app.get("/", (req, res) => {
    res.send("Welcome to the Ecommerce Grocery Shopping");
});
app.post('/create-order', verifyToken, async (req, res) => {
    const customerId = req.userId;
    if (!customerId) {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }
    console.log(customerId);

    // Fetch the cart details
    const { products, finalTotalPrice } = await Cart.getCartById(customerId);

    // Check if the cart exists and has products
    if (!products || products.length === 0) {
        return res.status(400).json({ error: 'No cart found or it is empty' });
    }

    // Log the products and total price for debugging
    console.log(products);
    console.log(`Total Price: ${finalTotalPrice}`);

    // Prepare the Razorpay order options
    const options = {
        amount: finalTotalPrice * 100, // amount in paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: `receipt#${customerId}`,
        notes: {
            customerId: customerId,
            products: products.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                weightOption: product.weightOption
            }))
        }
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/verify-payment', verifyToken, async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const customerId = req.userId;
        if (!customerId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }

        // Extract Razorpay payment details from request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Generate the expected signature using Razorpay's secret key
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        // Verify the signature
        if (generated_signature === razorpay_signature) {
            // Payment is valid, proceed with order fulfillment
            const cartDetails = await Cart.getCartByIdAfterPaymentConfirmation(customerId);
            console.log(cartDetails) // Assuming this returns products and finalTotalPrice
            const products = cartDetails.products; // Extract products
            const finalTotalPrice = cartDetails.finalTotalPrice;
            const productsJson = JSON.stringify(products);
            const orderDate = new Date();  // Current timestamp for order date
            const orderStatus = 'Confirmed';  // Initial status of the order

            // SQL query to insert the new order into the orders table
            const insertOrderQuery = `
            INSERT INTO orders (customerId, products, orderDate, orderStatus, totalPrice) 
            VALUES (?, ?, ?, ?, ?)
        `;

            // 9. Execute the query with the provided values
            await db.execute(insertOrderQuery, [customerId, productsJson, orderDate, orderStatus, finalTotalPrice]);

            // Clear the cart after successful order placement
            const clearCartQuery = `DELETE FROM cart WHERE customerId = ?`;
            await db.execute(clearCartQuery, [customerId]);
            // Send a success response
            res.redirect('/admin/order');
        } else {
            // Signature mismatch, payment verification failed
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// function logErrors(err, req, res, next) {
//     console.log(err.stack, "test");
//     logger.error(`Error occurred: ${err.message}`, { stack: err.stack });
//     next(err);
// }
// app.use(logErrors)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});