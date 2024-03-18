const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  rollNumber: {
    type: String,
    required: true,
    min: 5,
    max: 10,
    unique: true,
  },
  age: {
    default: "",
    type: String,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  job: {
    type: String,
    required: false,
  },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "psJobs",
    },
  ],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "apJobs",
    },
  ],
  postedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "psEvents",
    },
  ],
  volunteered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vol",
    },
  ],
  profilePicture: {
    default: null,
    type: Buffer,
    ref: "Image",
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
