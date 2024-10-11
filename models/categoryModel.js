import { db } from "../db.js";

const deleteCategoryById = async (categoryId) => {
    try {
        // Execute the DELETE query
        const [result] = await db.query(
            "DELETE FROM categories WHERE categoryId = ?",
            [categoryId]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            throw new Error("Blog post not found."); // If no rows were affected, the blog ID does not exist
        }

        return result; // Return the result for any additional handling if needed
    } catch (error) {
        // Handle any errors
        throw new Error("Error deleting the Category: " + error.message);
    }
};

const getAllCategories = async () => {
    const [result] = await db.execute("SELECT * FROM categories");
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

export default categoryModel;