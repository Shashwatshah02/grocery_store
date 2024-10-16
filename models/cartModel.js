const { db } = require("../db.js");

const getCartById = async (customerId) => {
    const [result] = await db.execute(
        `SELECT 
            c.quantity,
            p.productId, 
            p.images, 
            p.title,  
            v.weightOption,
            v.price,
            (c.quantity * v.price) AS totalPrice
        FROM cart c
        JOIN product_details p ON c.productId = p.productId
        LEFT JOIN variations v ON p.productId = v.productId
        WHERE c.customerId = ?`,
        [customerId]
    );

    // Calculate the final total price from the result
    const finalTotalPrice = result.reduce((acc, item) => acc + Number(item.totalPrice), 0);

    return {
        products: result,        // The array of product details
        finalTotalPrice: finalTotalPrice // The final total price
    };
};


const createCartByProductId = async (customerId, productId, quantity, variationId) => {
    const [result] = await db.execute(
        "INSERT INTO cart (customerId, productId, quantity, variationId) VALUES (?, ?, ?, ?)",
        [customerId, productId, quantity, variationId]
    );
    return result;
}


const updateCartById = async (customerId, productId, quantity) => {
    const [result] = await db.execute(
        "UPDATE cart SET quantity = ? WHERE customerId = ? AND productId = ?",
        [quantity, customerId, productId]
    );
    return result;
}

const deleteCartByProductId = async (customerId, productId) => {
    const [result] = await db.execute(
        "DELETE FROM cart WHERE customerId = ? AND productId = ?",
        [customerId, productId]
    );
    return result;
}

const cartModel = {
    getCartById,
    updateCartById,
    deleteCartByProductId,
    createCartByProductId
};

module.exports = cartModel;