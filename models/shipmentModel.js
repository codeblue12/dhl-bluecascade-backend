const mongoose = require('mongoose');

const shipmentSchema = mongoose.Schema(
  {
    body: {
      type: String,  
      required: true,
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
