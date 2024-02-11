const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');



const options = {
  provider: "locationiq",
  httpsAdapter: "https",
  apiKey: "pk.11a3e85903728fd1d17b4af332e606c3",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;