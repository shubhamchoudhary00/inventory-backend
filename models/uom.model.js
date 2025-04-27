const mongoose = require("mongoose");

const uomSchema = new mongoose.Schema(
  {
    uom: {
      type: String,
      required: true,
    },
    uom_short: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true } // Correctly specify timestamps here
);

const UOM = mongoose.model("uom", uomSchema);

module.exports = UOM;