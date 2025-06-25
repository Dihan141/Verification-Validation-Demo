const Bill = require('../model/billerModel');

// services er url gula ekhane thakbe
const Services = [

]

//ekhane 2 ta service ke iterate kore user khuja lagbe
//user khuja ar pay maybe alada function e kora jabe, maybeeee!

const findUserAndPay = async(req, res) => {
    try {
        res.send('Find user and pay bill');
    } catch (error) {
        console.error('Error in findUserAndPay:', error);
    }
}

module.exports = {
    findUserAndPay
}