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
    const [rows] = await db.execute(`
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

    if (rows && rows.length > 0) {
        const product = rows[0];
        console.log('Variations:', product.variations); // Check the value of variations

        // Only parse if variations is a string
        const variations = typeof product.variations === 'string' 
            ? JSON.parse(product.variations) 
            : product.variations;

        return {
            ...product,
            variations
        };
    } else {
        return null;
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

const updateVariations = async (productId, variations) => {
    // First, delete existing variations
    await db.execute("DELETE FROM variations WHERE productId = ?", [productId]);

    // Then, insert the updated variations
    const variationQueries = variations.map(variation => (  
        db.execute(
            "INSERT INTO variations (productId, weightOption, price) VALUES (?, ?, ?)",
            [productId, variation.weightOption, variation.price]
        )
    ));

    // Execute all queries
    await Promise.all(variationQueries);
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
    const [products] = await db.execute(
        `SELECT p.productId, p.title, p.description, p.stockAtPresent, p.categoryId, 
                p.images, MIN(v.price) AS price
        FROM product_details p
        LEFT JOIN variations v ON p.productId = v.productId
        WHERE p.categoryId = ?
        GROUP BY p.productId, p.title, p.description, p.stockAtPresent, p.categoryId, p.images`,  
        [categoryId]
    );
    return products;
};




const productModel = {
    getAllProducts,
    createProducts,
    updateProduct,
    getProductById,
    deleteProductById,
    getAllVariations,
    createVariations,
    updateVariations,
    getVariationByProductId,
    deleteVariationById,
    getProductByCategoryId
};

module.exports = productModel;