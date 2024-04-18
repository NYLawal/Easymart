const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    //  addedBy : {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    //  },
    addedBy: String,
    productName: {
      type: String,
      required: true,
      trim: true,
      uppercase:true
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    noInStock: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

productSchema.index({ "productName": "text", "description": "text", "category": "text"});
module.exports = Product;
