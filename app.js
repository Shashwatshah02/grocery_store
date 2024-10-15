const { getConnection, db } = require('./db.js');
const customerRoutes = require('./routes/customerRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const express = require("express");
const path = require("path");
const session = require("express-session");
const { fileURLToPath } = require("url");
// const __filename = fileURLToPath(module.url);
// const __dirname = path.dirname(__filename);
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
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


app.use(
    session({
        secret: "your-secret-key", // Replace with your own secret key
        resave: false, // Don't save session if it hasn't been modified
        saveUninitialized: false, // Don't create session until something is stored
        cookie: { maxAge: 60000 }, // Session expiration time (optional, 60 seconds in this example)
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to the Ecommerce Grocery Shopping");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});