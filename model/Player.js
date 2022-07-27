const mongoose = require("mongoose");

const PlayerSchema = mongoose.Schema({
    name:{
        type: String
    },
    about:{
        type: String
    },
    country:{
        type: String 
    },
    height:{
        type: Number
    },
    salary:{
        type: Number
    },
    brithDate:{
        type: Date
    },
    teamId:{
        type: mongoose.Types.ObjectId,
        ref:"Team"
    },
    logo:{
        type: String
    },
    coverImage:{
        type: String
    },
});

module.exports = mongoose.model("Player", PlayerSchema);