// shipmentRoutes.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const Shipment = require('../models/shipmentModel');
const { encode } = require('base-64')
// const router = express.Router();
const router = express.Router();
// const fetch = require('node-fetch');

const axios = require('axios');


const getShipmentDocs = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // console.log('Request Headers:', req.headers);
    requestBody = req.body;
    const username = "apN2tG5lL6tE0e";
    const password = "O!7iL@2vN$3nS$7m";
    const credentials = `${username}:${password}`;
    const base64Credentials = encode(credentials);
    // console.log(base64Credentials);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Credentials}`,
        'Access-Control-Allow-Origin': '*',
    };

    const config = {
        headers: headers,
    };

    const endpoint = 'https://express.api.dhl.com/mydhlapi/shipments';
    console.log('_________________endpoint______________', endpoint);

    try {
        const response = await axios.post(endpoint, requestBody, config);
        const result = response.data;
        const documents = result.documents;
        res.status(200).send(documents);
    } catch (error) {
        // console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
            if (error.response.data.detail === 'Multiple problems found, see Additional Details') {
                // If multiple problems found, send additional details
                res.status(error.response.status).send(error.response.data);
            } else {
                // Otherwise, send the regular details
                res.status(error.response.status).send(error.response.data.detail);
            }
        } else {
            console.error('Internal Server Error:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }

});


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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const totalShipments = await Shipment.countDocuments();
    const totalPages = Math.ceil(totalShipments / pageSize);

    const shipmentsData = await Shipment.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    const shipments = { shipmentsData, totalPages };

    res.send(shipments);
});



router.post('/', uploadShipment);
router.get('/getShipments', getAllShipments);
router.post('/get', (req, res) => {
    const jsonResponse = { message: 'this is debug' };
    res.send(jsonResponse);
});

router.post('/getDocuments', getShipmentDocs)


module.exports = router;
