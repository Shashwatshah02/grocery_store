const { db } = require("../db.js");


const getAllProducts = async () => {
    const [products] = await db.execute(`SELECT 
    p.images,            -- Assuming this column holds the image data
    p.title,
    p.productId,
    p.description,       
    c.categoryName,      
    p.stockAtPresent,    
    p.unit,
    v.weightOption,      -- Assuming this column holds the weight options
    v.price               -- Assuming this column holds the price
FROM 
    product_details p
JOIN 
    categories c ON p.categoryId = c.categoryId
JOIN 
    variations v ON p.productId = v.productId;  -- Adjust the join condition based on your schema

`);
    return products;
}

const createProducts = async (title, description, images, categoryId, stockAtPresent, unit) => {
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

const getAllVariations = async () => {
    const [variations] = await db.execute('SELECT * FROM variations');
    return variations;
}

const createVariations = async (productId, weightOption, price) => {
    const [variations] = await db.execute(
        'INSERT INTO variations (productId, weightOption, price) VALUES (?, ?, ?)',
        [productId, weightOption, price]
    );
    return variations;
}

const updateVariation = async (variationId, updatedVariation) => {
    const { weightOption, price } = updatedVariation;
    const [result] = await db.execute(
        "UPDATE variations SET weightOption = ?, price = ? WHERE variationId = ?",
        [weightOption, price, variationId]
    );
    return result;
}

const getVariationByProductId = async (productId) => {
    const [variation] = await db.execute('SELECT * FROM variations WHERE productId = ?', [productId]);
    return variation;
}

const deleteVariationById = async (variationId) => {
    const [result] = await db.execute('DELETE FROM variations WHERE variationId = ?', [variationId]);
    return result;
}

const getProductByCategoryId = async (categoryId) => {
    const [products] = await db.execute('SELECT * FROM product_details WHERE categoryId = ?', [categoryId]);
    return products;
}

const productModel = {
    getAllProducts,
    createProducts,
    updateProduct,
    getProductById,
    deleteProductById,
    getAllVariations,
    createVariations,
    updateVariation,
    getVariationByProductId,
    deleteVariationById,
    getProductByCategoryId
};

module.exports = productModel;