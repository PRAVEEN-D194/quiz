const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
    },
    verifyotp:{
        type:String,
        default:"",
    },
    verifyotpexpireat:{
        type:Number,
        default:0,
    },
    isverified:{
        type:Boolean,
        default:true,
    },
    resetotp:{
        type:String,
        default:"",
    },
    resetotpexpeireat:{
        type:Number,
        default:0,
    },
    point:{ 
        type:Number,
        default:0,
    },
    
})

module.exports = mongoose.model("userSchema", userSchema);
