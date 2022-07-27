const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async ()=>{
    const connect = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`)
}

module.exports = dbConnect;