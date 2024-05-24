const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  date: Date,
  time: String,
  duration: Number, 
});

module.exports = mongoose.model("Order", orderSchema);

