const Bill = require("../model/billerModel");
const User = require("../model/userModel");
const axios = require("axios");

// services er url gula ekhane thakbe
const serviceSources = [
  { url: `http://localhost:6000/api/users/`, name: "ams" },
  { url: `http://localhost:7000/api/users/`, name: "kaifa" },
];

//ekhane 2 ta service ke iterate kore user khuja lagbe
//user khuja ar pay maybe alada function e kora jabe, maybeeee!

const findUserAndPay = async (req, res) => {
  const { userId, paymentAmount, meterNumber } = req.body;

  if (!userId || !paymentAmount || !meterNumber) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    let user = null;
    let serviceUsed = "Unknown";

    for (const { url, name } of serviceSources) {
      try {
        console.log(`Fetching from ${url}${userId}`);
        const response = await axios.get(`${url}${userId}`);
        const data = response.data;
        
        if (data) {
          user = data;
          serviceUsed = name;
          break;
        }
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err.message);
        // Continue to next service
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found in any service" });
    }

    // Check if user already has a bill for this meter
    const existingBill = await Bill.findOne({
      userId: userId,
      meterId: meterNumber,
      serviceUsed: serviceUsed,
    });

    if (existingBill) {
      return res.status(400).json({
        message: "User already paid for this meter",
        bill: existingBill,
      });
    }

    // decrement user balance
    const newUser = await User.findOne({ userId: userId });
    if (!newUser) {
      return res.status(404).json({ message: "User not found in local database" });
    }

    if (newUser.balance < paymentAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    newUser.balance -= paymentAmount;
    await newUser.save();
    // Create a new bill
    const newBill = new Bill({
      userId: userId,
      meterId: meterNumber,
      serviceUsed: serviceUsed,
      amount: paymentAmount,
      status: "PAID",
    })
    
    const savedBill = await newBill.save();

    return res.status(200).json({
      message: "User found and payment saved",
      user,
      payment: savedBill,
    });

    //TODO: subtract kora lagbe amount theke logics
  } catch (error) {
    console.error("Error in findUserAndPay:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  findUserAndPay,
};
