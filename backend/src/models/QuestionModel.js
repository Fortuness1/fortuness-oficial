const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    editable: {
        type: Boolean,
        default: true
    },
    question: {
        type: String,
        required: true
    },
    item: {
        type: Array,
        required: true
    },
    correct_item: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    used_matches: {
        type: Array,
        default: []
    }
});
  
const QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = QuestionModel;