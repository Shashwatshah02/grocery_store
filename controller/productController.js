const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel.js");
const multer = require("multer");
const path = require("path");


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
    },
    getAllVariations: async (req, res) => {
        try {
            const variations = await Product.getAllVariations();
            res.status(200).json(variations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createVariations: async (req, res) => {
        try {
            const { productId, weightOption, price } = req.body;
            console.log(productId, weightOption, price);
            if (productId === undefined || weightOption === undefined || price === undefined) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const variation = await Product.createVariations(productId, weightOption, price);
            console.log(variation);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateVariation: async (req, res) => {
        try {
            const variationId = req.params.id;
            const updatedVariation = req.body;
            console.log(variationId, updatedVariation);
            const variation = await Product.updateVariation(variationId, updatedVariation);
            console.log(variation);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getVariationByProductId: async (req, res) => {
        try {
            const productId = req.params.id;
            const variation = await Product.getVariationByProductId(productId);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteVariationById: async (req, res) => {
        try {
            const variationId = req.params.id;
            const variation = await Product.deleteVariationById(variationId);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getProductByCategoryId: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const products = await Product.getProductByCategoryId(categoryId);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllProductsAdmin: async (req, res) => {
        try {
            const products = await Product.getAllProducts();
            res.render("theme/product-list", { products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createProductsAdmin: async (req, res) => {
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
    updateProductAdmin: async (req, res) => {
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
    getProductByIdAdmin: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.getProductById(productId);
            const categories = await Category.getAllCategories();
            console.log(product)
            res.render('theme/edit-product', { title: 'Product Edit', product: product[0], productId, categories });
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    },
    deleteProductByIdAdmin: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await Product.deleteProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllVariationsAdmin: async (req, res) => {
        try {
            const variations = await Product.getAllVariations();
            res.status(200).json(variations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createVariationsAdmin: async (req, res) => {
        try {
            const { productId, weightOption, price } = req.body;
            console.log(productId, weightOption, price);
            if (productId === undefined || weightOption === undefined || price === undefined) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const variation = await Product.createVariations(productId, weightOption, price);
            console.log(variation);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateVariationAdmin: async (req, res) => {
        try {
            const variationId = req.params.id;
            const updatedVariation = req.body;
            console.log(variationId, updatedVariation);
            const variation = await Product.updateVariation(variationId, updatedVariation);
            console.log(variation);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getVariationByIdAdmin: async (req, res) => {
        try {
            const variationId = req.params.id;
            const variation = await Product.getVariationById(variationId);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteVariationByIdAdmin: async (req, res) => {
        try {
            const variationId = req.params.id;
            const variation = await Product.deleteVariationById(variationId);
            res.status(200).json(variation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

}

module.exports = productController;