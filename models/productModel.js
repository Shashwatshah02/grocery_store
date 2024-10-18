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
    const [productData] = await db.execute(`
        SELECT 
            p.productId,
            p.title,
            p.description,
            p.stockAtPresent,
            p.unit,
            p.images,
            c.categoryName,
            JSON_ARRAYAGG(JSON_OBJECT('weightOption', v.weightOption, 'price', v.price)) AS variations
        FROM 
            product_details p
        LEFT JOIN 
            categories c ON p.categoryId = c.categoryId
        LEFT JOIN 
            variations v ON p.productId = v.productId
        WHERE 
            p.productId = ?
        GROUP BY 
            p.productId
    `, [productId]);

    // Check if productData exists and return the product with variations
    if (productData.length > 0) {
        return {
            ...productData[0],
            variations: JSON.parse(productData[0].variations) // Parse the JSON string to an object
        };
    } else {
        return null; // Return null if no product found
    }
};


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