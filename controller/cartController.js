const Cart = require('../models/cartModel');

const cartController = {
    getCartById: async (req, res) => {
        try {
            const { customerId } = req.body;
            const cart = await Cart.getCartById(customerId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateCartById: async (req, res) => {
        try {
            const { customerId, productId, quantity } = req.body;
            const result = await Cart.updateCartById(customerId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteCartByProductId: async (req, res) => {
        try {
            const { customerId, productId } = req.body;
            const result = await Cart.deleteCartByProductId(customerId, productId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
};