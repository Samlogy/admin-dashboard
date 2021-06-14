const { Schema, model } = require("mongoose");

const subscribeSchema = Schema({
  email:{ 
    type: String,
    unique:true, 
  },
  createdAt: { 
    type: Date, 
    default: Date.now(),
  } 
});

const Subscribe = model("Subscribe", subscribeSchema);


module.exports = Subscribe ;