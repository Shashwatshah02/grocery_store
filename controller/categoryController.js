const Category = require('../models/categoryModel.js');
const multer = require("multer");
const path = require("path");
const logger = require('../logger.js');


const storage = multer.diskStorage({
    destination: "./uploads/category/",
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
}).single("categoryImage");

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.getAllCategories();
            res.status(200).json(categories);
            console.log(categories);
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    getProductCategories: async (req, res) => {
        try {
            const categories = await Category.getAllCategories();
            return categories;
            console.log("getProductCategories");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    addCategories: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            const { categoryName } = req.body;
            console.log(categoryName);
            const categoryImage = req.file ? req.file.path : null;
            console.log(categoryImage);
            try {
                if (categoryName === undefined) {
                    return res.status(400).json({ error: "No category added" });
                }
                const result = await Category.addCategories(categoryName, categoryImage);
                // res.status(201).json({ id: result.insertId, title, content, categoryId });
                res.status(200).json(result);
            } catch (error) {
                logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
                res.status(500).json({ error: error.message });
            }
        });
        console.log("addCategories");
    },
    deleteCategorybyId: async (req, res) => {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        try {
            await Category.deleteCategoryById(categoryId); // Assuming you have this method in your Blog model
            res.status(200).json({ message: "Category deleted successfully" });
            console.log("deleteCategorybyId");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    getAllCategoriesAdmin: async (req, res) => {
        try {
            const categories = await Category.getAllCategories();
            res.render('theme/category-list', { categories });
            console.log("getAllCategoriesAdmin");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    addCategoriesAdmin: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            const { categoryName } = req.body;
            console.log(categoryName);
            const categoryImage = req.file ? req.file.path : null;
            console.log(categoryImage);
            try {
                if (categoryName === undefined) {
                    return res.status(400).json({ error: "No category added" });
                }
                const result = await Category.addCategories(categoryName, categoryImage);
                // res.status(201).json({ id: result.insertId, title, content, categoryId });
                res.redirect('/admin/categories');
            } catch (error) {
                logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
                res.status(500).json({ error: error.message });
            }
        });
        console.log("addCategoriesAdmin");
    },
    deleteCategorybyIdAdmin: async (req, res) => {
        console.log("deleteCategorybyIdAdmin");
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        try {
            await Category.deleteCategoryById(categoryId); // Assuming you have this method in your Blog model
            res.redirect('/admin/categories');
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    

}

module.exports = categoryController;