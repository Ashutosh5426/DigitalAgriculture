const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const organizationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      // trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 15,
    },
    location: {
      type: String,
      required: true
    }
  }, { timestamps: true });

module.exports = mongoose.model("Organization", organizationSchema);