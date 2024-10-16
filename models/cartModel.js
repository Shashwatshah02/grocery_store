const { db } = require("../db.js");

const getCartById = async (customerId) => {
    const [result] = await db.execute(
        "SELECT * FROM cart WHERE customerId = ?",
        [customerId]
    );
    return result;
};

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
};

module.exports = cartModel;