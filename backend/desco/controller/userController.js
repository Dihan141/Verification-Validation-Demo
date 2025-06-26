const User = require("../model/userModel");

const addUser = async (req, res) => {
    const { userId, name, balance, phone } = req.body;

    // Check for required fields
    if (!userId || !name) {
        return res.status(400).json({ message: "userId and name are required" });
    }

    try {
        // Create new user instance
        const newUser = new User({
            userId,
            name,
            balance: balance || 0, // fallback to 0 if not provided
            phone,
        });

        // Save to database
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (userId already exists)
            return res.status(409).json({
                message: "User with the same userId already exists",
                error: error.message,
            });
        }
        res.status(500).json({
            message: "Error adding user",
            error: error.message,
        });
    }
}

const getBalance = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user balance",
            error: error.message,
        });
    }
}

const setBalance = async (req, res) => {
    const { userId } = req.params;
    const { balance } = req.body;

    if (balance === undefined) {
        return res.status(400).json({ message: "Balance is required" });
    }

    try {
        const user = await User.findOneAndUpdate(
            { userId: userId },
            { balance: balance },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user balance",
            error: error.message,
        });
    }
}

module.exports = {
    addUser,
    getBalance,
    setBalance
}