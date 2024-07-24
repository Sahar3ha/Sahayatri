// importing
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./database/db');
const cors = require('cors');
const multiparty = require('connect-multiparty')

// Making express app

const app = express();
const corsPolicy ={
    origin : true,
    credentials : true,
    optionSuccessStatus : 200
}
app.use(cors(corsPolicy));




// dotenv config
dotenv.config();

   
// cors policy


// mongodb connection
connectDB();

// json middleware (to accept json data)
app.use(express.json());
app.use(multiparty());



// user routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/admin', require('./routes/vehicleRoutes'))

// defining port
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;