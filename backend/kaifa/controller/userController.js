const KaifaUser = require('../model/userSchema');

// Kaifa er collection theke sob user er data niye asha lagbe
const getUsers = async (req, res) => {
    try {
        res.send('Get users');
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
}

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
    payBill
};