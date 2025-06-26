const Bill = require("../model/billerModel");

// services er url gula ekhane thakbe
const serviceSources = [
  { url: `http://localhost:6000/api/users/`, name: "kaifa" },
  { url: `http://localhost:7000/api/users/`, name: "ams" },
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
        const response = await fetch(`${url}${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            user = data;
            serviceUsed = name;
            break;
          }
        }
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err.message);
        // Continue to next service
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found in any service" });
    }

    const newBill = new Bill({
      userId,
      meterId: meterNumber,
      serviceUsed,
      amount: paymentAmount,
      status: "PENDING", // optional, this is also the default
    });

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
