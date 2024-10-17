const { getConnection, db } = require('./db.js');
const customerRoutes = require('./routes/customerRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const express = require("express");
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
        cookie: { maxAge: 60000 }, // Session expiration time (optional, 60 seconds in this example)
    })
);



app.set('view engine', 'ejs');
app.set('views', './views');
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
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
    const token = req.headers.authorization?.split(' ')[1]; // Example: 'Bearer <token>'
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
    const customerId = decoded.customerId;
    console.log(customerId);
    const [cart] = await Cart.getCartById(customerId);

    console.log([cart]);
    if (!cart || cart.totalPrice === undefined) {
        return res.status(400).json({ error: 'No cart found or invalid total price' });
    }

    const totalPrice = cart.totalPrice;

    const options = {
        amount: totalPrice * 100, // amount in paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: `receipt#${customerId}`,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-payment', verifyToken, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Example: 'Bearer <token>'
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
    const customerId = decoded.customerId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId, totalPrice } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);

    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment is valid, proceed with order fulfillment
        const orderDate = new Date();  // Timestamp for the order date
        const orderStatus = 'Confirmed';  // Initial order status

        const insertOrderQuery = `
        INSERT INTO orders (customerId, productId, orderDate, orderStatus, totalPrice) 
        VALUES (?, ?, ?, ?, ?)
      `;

        // Execute the query with values
        await db.execute(insertOrderQuery, [customerId, productId, orderDate, orderStatus, totalPrice]);


        res.status(200).json({ success: true });
    } else {
        // Invalid payment, reject the request
        res.status(400).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});