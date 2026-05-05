require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");  
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// auth routes
app.use("/api/auth", authRoutes);

// product model
const Product = mongoose.model("Product", {
  name: String,
  category: String,
  sku: String,
  quantity: Number,
  price: Number,
  image: String,
});

// get all products
app.get("/api/products", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to get products" });
  }
});

// add product
app.post("/api/products", auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to add product" });
  }
});

// update product
app.put("/api/products/:id", auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
});

// delete product
app.delete("/api/products/:id", auth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// connect DB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});