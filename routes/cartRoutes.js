const express = require("express");
const cartController = require("../controller/cartController.js");
const { verifyToken } = require("../middleware/jwt.js");


const router = express.Router();

// router.get("/", verifyToken, cartController.getCartById);
// router.post("/", verifyToken, cartController.updateCartById);
// router.get("/delete/:id", verifyToken, cartController.deleteCartByProductId);


module.exports = router;