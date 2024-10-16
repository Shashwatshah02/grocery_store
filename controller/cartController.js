const Cart = require('../models/cartModel');
const jwt = require('jsonwebtoken');

const cartController = {
    getCartById: async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ error: "No token provided" });
            }
    
            // The token is usually sent as 'Bearer <token>'
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
            const customerId = decoded.customerId;
            console.log(customerId);
            const cart = await Cart.getCartById(customerId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateCartById: async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ error: "No token provided" });
            }
    
            // The token is usually sent as 'Bearer <token>'
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
            const customerId = decoded.customerId;
            const { productId, quantity } = req.body;
            const result = await Cart.updateCartById(customerId, productId, quantity);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteCartByProductId: async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ error: "No token provided" });
            }
    
            // The token is usually sent as 'Bearer <token>'
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
            const customerId = decoded.customerId;
            console.log(customerId);
            const productId = req.params.id;
            console.log(productId);
            const result = await Cart.deleteCartByProductId(customerId, productId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createCartByProductId: async (req, res) => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ error: "No token provided" });
            }
    
            // The token is usually sent as 'Bearer <token>'
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, 'yourSecretKey');  // Replace 'your-secret-key' with your JWT secret
            const customerId = decoded.customerId;
            const { productId, quantity, variationId } = req.body;
            console.log(productId, quantity, customerId);
            const result = await Cart.createCartByProductId(customerId, productId, quantity, variationId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


};

module.exports = cartController;