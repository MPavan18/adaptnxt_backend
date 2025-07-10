const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Admin routes (protected)
router.post("/createProduct", productController.isAdmin, productController.createProduct);
router.put("/:productId", productController.isAdmin, productController.updateProduct);
router.delete("/:productId", productController.isAdmin, productController.deleteProduct);

// Public route
router.get("/", productController.getAllProducts);

module.exports = router;