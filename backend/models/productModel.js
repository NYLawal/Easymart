const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    addedBy : {
       type: mongoose.Types.ObjectId,
       required: true,
       ref: 'User'
    },
    "admin name": String,
    productName: {
       type: String,
       required: true,
       trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
       type: String,
       required: true
    },
    price: {
       type: Number,
       required: true
    },
    noInStock: {
       type: Number,
       required: true
    },
    image_url: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }]
    }, {
    timestamps: true
    })

    const Product = mongoose.model('Product', productSchema)
module.exports = Product