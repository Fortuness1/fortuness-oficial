const mongoose = require("mongoose");

const WaitingMatchSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    semester: {
        type:String,
        required: true
    },
    data: {
        type:String,
        required: true
    },
    chat_availability: {
        type: Boolean,
        required: true
    },
    time: {
        type:String,
        required: true
    },
    question_times: {
        type: Number,
        required: true
    },
    questions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ],			
});
  
const WaitingMatchModel = mongoose.model("WaitingMatch", WaitingMatchSchema);

module.exports = WaitingMatchModel;