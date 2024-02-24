const express = require('express');
const dotenv = require('dotenv');
const app = express();
const Points = require('../Models/Point');
dotenv.config({path:'./config/config.env'});


 exports.getRoute = async (req, res,next) => {
    try {
        const { originPlace, destinationPlace } = req.body;
        const pickupPoints = await Points.find({name:originPlace});
        const dropPoints = await Points.find({name:destinationPlace});
        const origin = {lat:pickupPoints.coordinates[0],lon:pickupPoints.coordinates[1]};
        const destination = {lat:dropPoints.coordinates[0],lon:dropPoints.coordinates[1]};
        const mapRoute = await generateMapRoute(origin,destination);

       return res.status(200).json({ mapRoute });
    } catch (error) {
        next(error)
    }
};


async function generateMapRoute(origin, destination) {
    try {
        
        const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.lon},${origin.lat}%3B${destination.lon},${destination.lat}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.MAPBOX_API_TOKEN}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.code !== 'Ok') {
            throw new Error('Failed to fetch directions');
        }

        const directionLine = data.routes[0].geometry;
        return directionLine;
    } catch (err) {
        console.error(err);
        return null; 
    }
}



