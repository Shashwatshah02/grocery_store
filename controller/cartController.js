const Cart = require('../models/cartModel');
const jwt = require('jsonwebtoken');
const logger = require('../logger.js');

const cartController = {
    getCartById: async (req, res) => {
        try {
        const customerId = req.userId;
        if (!customerId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        console.log(customerId);
        const cart = await Cart.getCartById(customerId);
        res.status(200).json(cart);
        console.log("getCartById");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    updateCartById: async (req, res) => {
        try {
        const customerId = req.userId;
        if (!customerId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        const { productId, quantity } = req.body;
        console.log(productId, quantity);
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Invalid product ID or quantity' });
        }
        const result = await Cart.updateCartById(customerId, productId, quantity);
        res.status(200).json(result);
        console.log("updateCartById");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    deleteCartByProductId: async (req, res) => {
        try {
        const customerId = req.userId;
        if (!customerId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        console.log(customerId);
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        console.log(productId);
        const result = await Cart.deleteCartByProductId(customerId, productId);
        res.status(200).json(result);
        console.log("deleteCartByProductId");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    createCartByProductId: async (req, res) => {
        try {
        const customerId = req.userId;
        if (!customerId) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }
        const { productId, quantity, variationId } = req.body;
        if (!productId || !quantity || !variationId) {
            return res.status(400).json({ error: 'Invalid product ID or quantity' });
        }
        console.log(productId, quantity, customerId);
        const result = await Cart.createCartByProductId(customerId, productId, quantity, variationId);
        res.status(200).json(result);
        console.log("createCartByProductId");
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    }


};

module.exports = cartController;