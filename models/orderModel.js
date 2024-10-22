const { db } = require("../db.js");


const getAllOrders = async () => {
    const [orders] = await db.execute(`
        SELECT 
            c.customerName,
            c.customerPhone,
            c.customerAddress,
            c.customerEmail,
            c.customerCity,
            c.customerZipCode,
            o.orderId,
            o.orderDate,
            o.orderStatus,
            o.totalPrice,
            o.products  -- Assuming you're storing product details in this column
        FROM 
            orders o
        JOIN 
            customer_details c ON o.customerId = c.customerId
    `);
    
    // You might want to parse the products JSON if needed
    orders.forEach(order => {
        if (order.products) {
            order.products = JSON.parse(order.products); // Parsing JSON if stored as a string
        }
    });
    
    return orders;
};


const createOrders = async (customerId, productId, orderStatus, totalPrice) => {
    const [result] = await db.execute('INSERT INTO orders (customerId, productId, orderStatus, totalPrice) VALUES (?, ?, ?, ?)', [customerId, productId, orderStatus, totalPrice]);
    return result;
}

const updateOrder = async (customerId, productId, orderStatus, totalPrice) => {
    const [result] = await db.execute('UPDATE orders SET customerId = ?, productId = ?, orderStatus = ?, totalPrice = ? WHERE orderId = ?', [customerId, productId, orderStatus, totalPrice]);
    return result;
}

const getOrderByCustomerId = async (customerId) => {
    const [orders] = await db.execute(`
        SELECT 
            c.customerName,
            c.customerPhone,
            c.customerAddress,
            c.customerEmail,
            c.customerCity,
            c.customerZipCode,
            o.orderId,
            o.orderDate,
            o.orderStatus,
            o.totalPrice,
            o.products  -- Assuming you're storing product details in this column
        FROM 
            orders o
        JOIN 
            customer_details c ON o.customerId = c.customerId
        WHERE 
            o.customerId = ?
    `, [customerId]);  // Using parameterized queries to prevent SQL injection
    
    // Parsing the products JSON if needed
    orders.forEach(order => {
        if (order.products) {
            order.products = JSON.parse(order.products); // Parsing JSON if stored as a string
        }
    });
    
    return orders;
};


const deleteOrderById = async (orderId) => {
    const [result] = await db.execute('DELETE FROM orders WHERE orderId = ?', [orderId]);
    return result;
}

const orderModel = {
    getAllOrders,
    createOrders,
    updateOrder,
    getOrderByCustomerId,
    deleteOrderById,
};

module.exports = orderModel;