const { db } = require("../db.js");

const getCartById = async (customerId) => {
    const [result] = await db.execute(
        `SELECT 
            c.quantity,
            c.id,
            p.productId, 
            p.images, 
            p.title,  
            v.weightOption,
            v.price,
            (c.quantity * v.price) AS totalPrice
        FROM cart c
        JOIN product_details p ON c.productId = p.productId
        LEFT JOIN variations v ON c.variationId = v.variationId  -- Join on the selected variation
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

const getCartByIdAfterPaymentConfirmation = async (customerId) => {
    const [result] = await db.execute(
        `SELECT 
            c.quantity,
            c.id,
            p.productId, 
            p.images, 
            p.title,  
            p.stockAtPresent,
            v.weightOption,
            v.price,
            (c.quantity * v.price) AS totalPrice
        FROM cart c
        JOIN product_details p ON c.productId = p.productId
        LEFT JOIN variations v ON c.variationId = v.variationId  -- Join on the selected variation
        WHERE c.customerId = ?`,
        [customerId]
    );

    // Calculate the final total price from the result
    const finalTotalPrice = result.reduce((acc, item) => acc + Number(item.totalPrice), 0);

    // Update stock and attach new stock to each item
    result.forEach(item => {
        const quantity = item.quantity;
        const weightOption = item.weightOption; // This should represent the weight for the specific variation

        // Calculate the total weight for this item
        const totalWeight = weightOption * quantity;

        // Reduce from the product's stock
        const newStock = item.stockAtPresent - totalWeight;

        // Update the item's stock value in the result
        item.newStock = newStock;

        // Here you might want to check for negative stock and handle it accordingly
        // e.g., if (newStock < 0) { /* handle stock underflow */ }
    });

    // Optional: Update the product's stock in the database
    await Promise.all(result.map(item => {
        return db.execute(
            `UPDATE product_details SET stockAtPresent = ? WHERE productId = ?`,
            [item.newStock, item.productId]
        );
    }));

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

const deleteCartById = async (customerId, cartId) => {
    const [result] = await db.execute(
        "DELETE FROM cart WHERE customerId = ? AND id = ?",
        [customerId, cartId]
    );
    return result;
}

const cartModel = {
    getCartById,
    updateCartById,
    deleteCartById,
    createCartByProductId,
    getCartByIdAfterPaymentConfirmation
};

module.exports = cartModel;