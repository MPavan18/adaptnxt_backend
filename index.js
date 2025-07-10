const express=require("express")
const app=express()

const mongoose=require("mongoose")
const dotenv=require("dotenv")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
dotenv.config()
const PORT=process.env.PORT ||4000;
app.use(express.json());
app.use(cors());
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const mongoURL = process.env.MONGO_URL   
const jwtSecret = process.env.JWT_SECRET 

// Connect to MongoDB
const mongoURI = process.env.MONGO_URL;
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World! Welcome to localhost!');
});
app.listen(PORT,()=>{
   console.log(`app is listing on port ${PORT}`)
})