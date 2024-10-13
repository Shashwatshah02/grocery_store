import { db } from "../db.js";

const getAllProducts = async () => {
    const [products] = await db.execute('SELECT * FROM product_details');
    return products;
}

const createProducts = async ( title, description, images, categoryId, stockAtPresent, unit ) => {
    // Convert the images array to a JSON string
    const imagesString = JSON.stringify(images);

    console.log(title, description, imagesString, categoryId, stockAtPresent, unit);
    const [products] = await db.execute(
        'INSERT INTO product_details (title, description, images, categoryId, stockAtPresent, unit) VALUES (?, ?, ?, ?, ?, ?)', 
        [title, description, imagesString, categoryId, stockAtPresent, unit]
    );
    return products;
}

const updateProduct = async (productId, updatedProduct) => {
    const { title, description, images, categoryId, stockAtPresent, unit } = updatedProduct;

    // Convert the images array or object to a JSON string
    const imagesString = JSON.stringify(images);

    const [result] = await db.execute(
        "UPDATE product_details SET title = ?, description = ?, images = ?, categoryId = ?, stockAtPresent = ?, unit = ? WHERE productId = ?",
        [title, description, imagesString, categoryId, stockAtPresent, unit, productId]
    );
    
    return result;
}


const getProductById = async (productId) => {
    const [product] = await db.execute('SELECT * FROM product_details WHERE productId = ?', [productId]);
    return product;
}

const deleteProductById = async (productId) => {
    const [result] = await db.execute('DELETE FROM product_details WHERE productId = ?', [productId]);
    return result;
}

const productModel = {
    getAllProducts,
    createProducts,
    updateProduct,
    getProductById,
    deleteProductById,
};

export default productModel;