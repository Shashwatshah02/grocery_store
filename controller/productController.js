import Product from "../models/productModel.js";

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
}

export default productController;