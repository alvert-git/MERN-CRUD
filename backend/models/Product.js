const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  images:{
    type:[String],
    required:false
  },
});
const Product = mongoose.model("products", productSchema);
module.exports = Product;