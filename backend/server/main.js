const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(
  "mongodb+srv://junaidkhanhud_db_user:Junaid12345@inventory-app.e4rkeeg.mongodb.net/inventory_management?appName=inventory-app"
)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


  // product schema and model
  const Product = mongoose.model("Product", {
  name: String,
  category: String,
  sku: String,
  quantity: Number,
  price: Number,
  image: String,
});

// get all products

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

//  post a new product
app.post("/api/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});


// edit a product
app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(updated);
});

// delete a product
app.delete("/api/products/:id", async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ message: "Deleted" });
});

// server setup and server start.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 