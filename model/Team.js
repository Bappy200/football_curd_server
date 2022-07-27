const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
    name:{
        type: String
    },
    about:{
        type: String
    },
    totalCost:{
        type: Number
    },
    establish:{
        type: Date
    },
    logo:{
        type: String
    },
    coverImage:{
        type: String
    },
});

module.exports = mongoose.model("Team", TeamSchema);