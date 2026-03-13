const axios = require("axios");

const runTravelTools = async (answers) => {

let transport = {};

if(answers.transport === "train"){
  const res = await axios.post("http://localhost:5000/api/train-search/search",{
     fromCity:answers.fromCity,
     toCity:answers.toCity
  });
  transport.trains = res.data;
}

if(answers.transport === "bus"){
  const res = await axios.post("http://localhost:5000/api/bus-search/search-buses",{
     fromCity:answers.fromCity,
     toCity:answers.toCity,
     departureTime:answers.time
  });
  transport.buses = res.data;
}

const restaurants = await axios.post(
"http://localhost:5000/api/food-stalls",
{
 query:"local food",
 city:answers.city
});

const hotels = await axios.post(
"http://localhost:5000/api/accommodation/search",
{
 place:answers.place,
 city:answers.city,
 type:answers.accommodation
});

return {
 transport,
 restaurants:restaurants.data,
 hotels:hotels.data
};

};

module.exports = runTravelTools;