const Order = require('../models/orderModel.js');


const orderController = {
    getAllOrders: async (req, res) => {
        try {
        const orders = await Order.getAllOrders();
        res.status(200).json(orders);
        console.log("get all orders")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createOrders: async (req, res) => {
        try {
        const { customerId, productId, orderStatus, totalPrice } = req.body;
        if (customerId === undefined || productId === undefined || orderStatus === undefined || totalPrice === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const order = await Order.createOrders(customerId, productId, orderStatus, totalPrice);
        res.status(200).json(order);
        console.log("create order")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateOrder: async (req, res) => {
        try {
        const { orderId } = req.params;
        if (orderId === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const { customerId, productId, orderStatus, totalPrice } = req.body;
        if (customerId === undefined || productId === undefined || orderStatus === undefined || totalPrice === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const order = await Order.updateOrder(orderId, customerId, productId, orderStatus, totalPrice);
        res.status(200).json(order);
        console.log("update order")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getOrderByCustomerId: async (req, res) => {
        try {
        const customerId = req.userId;
        if (customerId === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        console.log(customerId);
        const order = await Order.getOrderByCustomerId(customerId);
        res.status(200).json(order);
        console.log("get order by customer id")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllOrdersAdmin: async (req, res) => {
        try {
        const orders = await Order.getAllOrders();
        console.log(orders);
        res.render('theme/order-list', { orders });
        console.log("get all orders admin")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createOrdersAdmin: async (req, res) => {
        try {
        const { customerId, productId, orderStatus, totalPrice } = req.body;
        if (customerId === undefined || productId === undefined || orderStatus === undefined || totalPrice === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const order = await Order.createOrders(customerId, productId, orderStatus, totalPrice);
        res.status(200).json(order);
        console.log("create order admin")
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
module.exports = orderController;