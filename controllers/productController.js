const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET 

module.exports = {
  // Middleware to check if user is admin
  isAdmin: (req, res, next) => {
    const token = req.headers.token
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  },

  // Create Product
  createProduct: async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const product = new Product({
        name,
        price,
        description,
        createdBy: req.user.userId,
      });

      await product.save();
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update Product
  updateProduct: async (req, res) => {
    const { productId } = req.params;
    const { name, price, description } = req.body;

    if (!name && !price && !description) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Unauthorized to update this product" });
      }

      if (name) product.name = name;
      if (price) product.price = price;
      if (description) product.description = description;

      await product.save();
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete Product
  deleteProduct: async (req, res) => {
    const { productId } = req.params;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Unauthorized to delete this product" });
      }

      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get All Products (for all users)
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("createdBy", "email");
      res.status(200).json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};