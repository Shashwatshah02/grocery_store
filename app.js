import { getConnection, db } from './db.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from "cors";
import bodyParser from "body-parser";

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

app.use(
    session({
        secret: "your-secret-key", // Replace with your own secret key
        resave: false, // Don't save session if it hasn't been modified
        saveUninitialized: false, // Don't create session until something is stored
        cookie: { maxAge: 60000 }, // Session expiration time (optional, 60 seconds in this example)
    })
);

app.route("/login")
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
                return res.render('theme/index', { title: 'Home Page' });

            } else {
                // Password is incorrect
                return res.status(401).render("login", { error: "Incorrect password" });
            }
        } catch (error) {
            // Handle any server-side errors
            return res.status(500).json({ error: error.message });
        }
    });


app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
        } else {
            res.redirect('/login'); // Redirect to login page after logging out
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});