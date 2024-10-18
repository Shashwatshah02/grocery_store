const { db } = require("../db.js");


const getAllProducts = async () => {
    const [products] = await db.execute(`SELECT 
    p.images,                                -- Product image
    p.title,                                 -- Product title
    p.productId,                             -- Product ID
    p.description,                           -- Product description
    c.categoryName,                          -- Category name
    p.stockAtPresent,                        -- Stock available
    p.unit,                                  -- Unit of measurement
    GROUP_CONCAT(v.weightOption ORDER BY v.weightOption) AS weightOptions,  -- Aggregate weight options
    GROUP_CONCAT(v.price ORDER BY v.price) AS prices                        -- Aggregate prices
FROM 
    product_details p
JOIN 
    categories c ON p.categoryId = c.categoryId
LEFT JOIN 
    variations v ON p.productId = v.productId
GROUP BY 
    p.productId, p.images, p.title, p.description, c.categoryName, p.stockAtPresent, p.unit;
`);
    return products;
}

const createProducts = async (title, description, images, categoryId, stockAtPresent, unit) => {
    // Convert the images array to a JSON string

    console.log(title, description, images, categoryId, stockAtPresent, unit);
    const [products] = await db.execute(
        'INSERT INTO product_details (title, description, images, categoryId, stockAtPresent, unit) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, images, categoryId, stockAtPresent, unit]
    );
    return products;
}

const updateProduct = async (productId, updatedProduct) => {
    const { title, description, images, categoryId, stockAtPresent, unit } = updatedProduct;

    const [result] = await db.execute(
        "UPDATE product_details SET title = ?, description = ?, images = ?, categoryId = ?, stockAtPresent = ?, unit = ? WHERE productId = ?",
        [title, description, images, categoryId, stockAtPresent, unit, productId]
    );

    return result;
}


const getProductById = async (productId) => {
    const [product] = await db.execute(`
        SELECT 
            p.*,
            c.categoryName,
            v.weightOption,
            v.price
        FROM 
            product_details p
        LEFT JOIN 
            categories c ON p.categoryId = c.categoryId
        LEFT JOIN 
            variations v ON p.productId = v.productId
        WHERE 
            p.productId = ?
    `, [productId]);
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