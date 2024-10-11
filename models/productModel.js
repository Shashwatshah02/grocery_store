import { db } from "../db.js";

const getAllProducts = async () => {
    const [products] = await db.execute('SELECT * FROM product_details');
    return products;
}

const productModel = {
    getAllProducts
};

export default productModel;