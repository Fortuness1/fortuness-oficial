const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
      unique: true,
    },
    occupation:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profile_photo:{
      type: String,
      default: "default-profire-photo.png"
    },
    questions:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],
    waiting_matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WaitingMatch"
      }
    ],
    created_matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
      }
    ],
    participated_matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
      }
    ],
  });
  
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;