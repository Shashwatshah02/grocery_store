import {getConnection, db} from './db.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(bodyParser.json());

app.use('/customer', customerRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the E-commerce API");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});