const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const propertySchema = new mongoose.Schema({
  ownedBy: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    // trim: true,
  },
  region: {
    type: ObjectId,
    ref: "Region",
    required: true,
    unique: true
  },
  field: {
    type: ObjectId,
    ref: "Field",
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);