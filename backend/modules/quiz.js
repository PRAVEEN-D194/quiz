const mongoose = require("mongoose");

const question = new mongoose.Schema({
    code:{
        type:String,
        default: () => Math.floor(100000 + Math.random() * 900000).toString()
    },

    Title:{
        type:String,
        required:true
    },
    questions:[{
        question:{
            type: String,
            required:true,
        },
        answers:[{
            text:{
                type: String,
                required:true,
            },
            isCorrect:{
                type:Boolean,
                required:true,
            }
        }]
    }],
    
    createdAt: {
    type: Date,
    default: Date.now,
  }
})

question.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

module.exports = mongoose.model("quiz", question);