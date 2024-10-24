const { db } = require("../db.js");


const deleteCategoryById = async (categoryId) => {
    try {
        const [defaultCategoryResult] = await db.query(
            "SELECT categoryId FROM categories WHERE categoryName = ?",
            ['Default-Category']
        );

        if (defaultCategoryResult.length === 0) {
            throw new Error("Default-Category not found. Please create one.");
        }

        const defaultCategoryId = defaultCategoryResult[0].categoryId;
        await db.query(
            "UPDATE product_details SET categoryId = ? WHERE categoryId = ?",
            [defaultCategoryId, categoryId]
        );
        const [result] = await db.query(
            "DELETE FROM categories WHERE categoryId = ?",
            [categoryId]
        );

        return result; 
    } catch (error) {
        
        await db.rollback();
        throw new Error("Error deleting the Category: " + error.message);
    }
};


const getAllCategories = async () => {
    const [result] = await db.execute("SELECT * FROM categories");
    console.log(result);
    return result;
};
const addCategories = async (categoryName, categoryImage) => {
    const [result] = await db.execute(
        "INSERT INTO categories (categoryName, categoryImage) VALUES (?, ?)",
        [categoryName, categoryImage]
    );
    return result;
};

const categoryModel = {
    getAllCategories,
    addCategories,
    deleteCategoryById,
};

module.exports = categoryModel;