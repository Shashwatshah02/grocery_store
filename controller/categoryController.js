import Category from '../models/categoryModel.js';


const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Blog.getAllCategories();
            console.log(categories);
            res.render("categories", { categories: categories, layout: false });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    addCategories: async (req, res) => {
        const { categoryName } = req.body;
        console.log(categoryName);
        try {
            if (categoryName === undefined) {
                return res.status(400).json({ error: "No category added" });
            }
            await Blog.addCategories(categoryName);
            // res.status(201).json({ id: result.insertId, title, content, categoryId });
            res.redirect("/api/blogs/categories");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteCategorybyId: async (req, res) => {
        const categoryId = req.params.id;
        try {
            await Blog.deleteCategoryById(categoryId); // Assuming you have this method in your Blog model
            res.redirect("/api/blogs/categories");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
}

export default categoryController;