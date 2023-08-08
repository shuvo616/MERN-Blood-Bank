const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/DB');
const path = require('path');

// dot env file config
dotenv.config();

//MongoDb Connection
connectDB();

//Rest object
const app = express()

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//Routs
//1 test route
app.use('/api/v1/test', require('./routes/testRouts'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

//Static Files configure
app.use(express.static(path.join(__dirname, './client/build')));

//Static files route
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

//Port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(`Node server running in ${process.env.DEV_MODE} on port :  ${process.env.PORT}`.bgBlue.white);
});