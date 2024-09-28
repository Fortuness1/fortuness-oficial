const mongoose = require("mongoose");;

const matchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    chat_availability: {
        type: Boolean,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    name_host: {
        type: String,
        required: true,
    },
    question_times: {
        type: Number,
        required: true,
    },
    players: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    questions: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    status: {
        type: String,
        uppercase: true,
        default: "WAITING"
    },
    pin: {
        type: Number,
        required: true,
        unique: true
    }
});

const MatchModel = mongoose.model("Match", matchesSchema);

module.exports = MatchModel;