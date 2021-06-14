const { Schema, model } = require("mongoose");

const productsSchema = Schema({
  name:{ 
    type: String,
  },
  description:{ 
    type: String,
  },
  price:{ 
    type: Number,
  },
  amount:{ 
    type: Number,
  },
  features:{ 
    type: [String],
  },
  createdAt: { 
    type: Date, 
    default: Date.now(),
  },
  editedAt: { 
    type: Date, 
    default: null,
  },
});

const Product = model("Product", productsSchema);

module.exports = Product ;