import { db } from "../db.js";

const getAllOrders = async () => {
    const [orders] = await db.execute('SELECT * FROM orders');
    return orders;
}

const createOrders = async (customerId, productId, orderStatus, totalPrice) => {
    const [result] = await db.execute('INSERT INTO orders (customerId, productId, orderStatus, totalPrice) VALUES (?, ?, ?, ?)', [customerId, productId, orderStatus, totalPrice]);
    return result;
}

const updateOrder = async (customerId, productId, orderStatus, totalPrice) => {
    const [result] = await db.execute('UPDATE orders SET customerId = ?, productId = ?, orderStatus = ?, totalPrice = ? WHERE orderId = ?', [customerId, productId, orderStatus, totalPrice]);
    return result;
}

const getOrderById = async (orderId) => {
    const [order] = await db.execute('SELECT * FROM orders WHERE orderId = ?', [orderId]);
    return order;
}

const deleteOrderById = async (orderId) => {
    const [result] = await db.execute('DELETE FROM orders WHERE orderId = ?', [orderId]);
    return result;
}

const orderModel = {
    getAllOrders,
    createOrders,
    updateOrder,
    getOrderById,
    deleteOrderById,
};

export default orderModel;