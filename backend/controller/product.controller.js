import Product from "../models/product.model.js";

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, quantity } = req.body;
    // const image = req.files?.map((file) => `/uploads/${file.filename}`);
    const image = req.files?.map((file) => file.filename);
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0 ||
      !quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images and quantity are required",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image,
      quantity: parseInt(quantity),
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update product quantity :/api/product/quantity
export const updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { quantity: parseInt(quantity) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
      message: "Quantity updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get best sellers based on order quantities : /api/product/best-sellers
export const getBestSellers = async (req, res) => {
  try {
    // Aggregate across orders to find total ordered quantity per product
    const Order = (await import("../models/order.model.js")).default;

    const agg = await Order.aggregate([
      { $match: { $or: [{ paymentType: "COD" }, { isPaid: true }] } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalOrdered: { $sum: "$items.quantity" } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
    ]);

    const productIds = agg.map((a) => a._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Preserve order according to aggregation
    const productsWithCount = productIds
      .map((id) => {
        const prod = products.find((p) => String(p._id) === String(id));
        const count = agg.find((a) => String(a._id) === String(id))?.totalOrdered || 0;
        return prod ? { product: prod, totalOrdered: count } : null;
      })
      .filter(Boolean);

    res.status(200).json({ success: true, bestSellers: productsWithCount });
  } catch (error) {
    console.error("Error in getBestSellers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};