const AmsUser = require('../model/userSchema');

// ams er collection theke sob user er data niye asha lagbe
const getUsers = async (req, res) => {
    try {
        const users = await AmsUser.find(); // fetch all users from the collection
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

const addUser = async (req, res) => {
  try {
    const { userId, meterId, name, balance, phone } = req.body;

    // Check for required fields
    if (!userId || !meterId || !name) {
      return res.status(400).json({ message: 'userId, meterId, and name are required' });
    }

    // Create new user instance
    const newUser = new AmsUser({
      userId,
      meterId,
      name,
      balance: balance || 0, // fallback to 0 if not provided
      phone
    });

    // Save to database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (userId or meterId already exists)
      return res.status(409).json({
        message: 'User with the same userId or meterId already exists',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Error adding user',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // assuming userId is passed as a URL param

    const user = await AmsUser.findOne({ userId: userId }); // find user by userId

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Bill pay korar jonno user er data update kora lagbe
// Ekhane user er balance update kora hobe
const payBill = async (req, res) => {
    try {
        res.send('Pay bill');
    } catch (error) {
        res.status(500).json({
            message: 'Error paying bill',
            error: error.message
        });
    }
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    payBill
};