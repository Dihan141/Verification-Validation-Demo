require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/userRoutes');

app.use(cors({
    origin: '*'
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB for ams');
}).catch((err)=>{
    console.log(err);
});

app.use('/api/users', userRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})