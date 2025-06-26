const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  meterId: {
    type: String,
    required: true,
  },
  serviceUsed: {
    type: String,
    enum: ["kaifa", "ams", "Unknown"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["PAID", "PENDING", "FAILED"],
    default: "PENDING"
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Bill", billSchema);
