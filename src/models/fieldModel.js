const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const fieldSchema = new mongoose.Schema({
  ownedBy: {
    type: String,
    required: true
  },
  region: {
    type: ObjectId,
    ref: "Region",
    required: true
  },
  area: {
    type: String,
    required: true,
    // trim: true,
  },
  latitude: {
    type: String,
    required: true,
    unique: true,
    // trim: true,
  },
  longitude: {
    type: String,
    required: true
  },
  crops: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Field", fieldSchema);