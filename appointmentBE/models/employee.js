const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  working_days: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }]
});
employeeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
