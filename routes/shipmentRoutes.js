// shipmentRoutes.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const Shipment = require('../models/shipmentModel');

const router = express.Router();

const uploadShipment = asyncHandler(async (req, res) => {
    try {
        const requestBodyString = JSON.stringify(req.body);
        const requestBody = JSON.stringify(req.body.row);
        const requestResponse = JSON.stringify(req.body.documents);

        const newShipment = new Shipment({ body: requestBody, response: requestResponse });

        const savedShipment = await newShipment.save();

        res.json(savedShipment);
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ error: 'Failed to save shipment to the database' });
        return;
    }
});

const getAllShipments = asyncHandler(async (req, res) => {
    const shipments = await Shipment.find();
    // console.log(shipments.body);
    res.json(shipments);
  });

router.post('/', uploadShipment);
router.get('/getShipments', getAllShipments);
router.get('/get', (req,res)=>{
    res.send('this is debug')
});

module.exports = router;
