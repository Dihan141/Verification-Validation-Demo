const Bill = require("../model/billerModel");
const User = require("../model/userModel");
const axios = require("axios");
const mongoose = require("mongoose");
const { sendServiceDownEmail } = require("../utils/mailer");
const { shouldSendAlert } = require("../utils/alertThrottle");

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

  let session;

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
        if (!err.response) {
          //throttling badddd apatoto
          //if (shouldSendAlert(name)) {
            await sendServiceDownEmail(name, url);
          //}
          console.error(`❌ SERVICE DOWN: ${name} - ${err.message}`);
        } else {
          console.warn(`⚠️ Service ${name} responded with status ${err.response.status}`);
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found in any service" });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const existingBill = await Bill.findOne({
      userId,
      meterId: meterNumber,
      serviceUsed,
    }).session(session);

    if (existingBill) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "User already paid for this meter",
        bill: existingBill,
      });
    }

    const localUser = await User.findOne({ userId }).session(session);

    if (!localUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found in local database" });
    }

    if (localUser.balance < paymentAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    localUser.balance -= paymentAmount;
    await localUser.save({ session });

    // Create bill
    const newBill = new Bill({
      userId,
      meterId: meterNumber,
      serviceUsed,
      amount: paymentAmount,
      status: "PAID",
    });
    const savedBill = await newBill.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "User found and payment saved (with transaction)",
      user,
      payment: savedBill,
    });
  } catch (error) {
    console.error("💥 Error in findUserAndPay:", error);

    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
        console.warn("⚠️ Transaction aborted and rolled back.");
      } catch (rollbackErr) {
        console.error("❌ Rollback failed:", rollbackErr);
      }
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  findUserAndPay,
};
