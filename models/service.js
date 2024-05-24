const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true 
  },
  price: {
    type: Number,
    required: true 
  },
  description: String 
});

module.exports = mongoose.model("Service", serviceSchema);
