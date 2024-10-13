import Product from "../models/productModel.js";
import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: "./uploads/products/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images Only!");
        }
    },
}).array("images", 5); // Change to .array() to accept multiple images (up to 5 images)



const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createProducts: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            try {
                const { title, description, categoryId, stockAtPresent, unit } = req.body;
                // console.log(title, description, categoryId, stockAtPresent, unit)
                if (title === undefined || description === undefined || categoryId === undefined || stockAtPresent === undefined || unit === undefined) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                const images = req.files ? req.files.map(file => file.path) : null;
                // console.log(images);
                const product = await Product.createProducts(title, description, images, categoryId, stockAtPresent, unit);
                console.log(product);
                res.status(200).json(product);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    updateProduct: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            try {
                const productId = req.params.id;
                const updatedProduct = req.body;
                const images = req.files ? req.files.map(file => file.path) : null;
                updatedProduct.images = images;
                console.log(productId, updatedProduct);
                const product = await Product.updateProduct(productId, updatedProduct);
                console.log(product);
                res.status(200).json(product);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    getProductById: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.getProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteProductById: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.deleteProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default productController;