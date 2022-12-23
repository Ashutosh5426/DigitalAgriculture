const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const regionSchema = new mongoose.Schema({
  seasons: {
    type: [String],
    required: true,
    // trim: true,
  },
  cropCycle: {
    type: [String],
    required: true
  },
  regionalCrops: {
    type: [String],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Region", regionSchema);