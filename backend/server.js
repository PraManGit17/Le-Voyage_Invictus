const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const aiRoutes = require("./routes/airoutes")
const travelRoutes = require("./routes/travelRoutes")
const planTripRoutes = require("./routes/planTripRoutes");

// final product
const itineraryRoutes = require("./routes/itineraryRoutes");
const trainSearch = require("./routes/trainSearchRoutes");
const foodRoutes = require("./routes/foodRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const busearch =  require("./routes/busSearchRoutes")
const chatRoutes = require("./routes/chatRoutes");

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api", travelRoutes);
app.use("/api/trip", planTripRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/train-search", trainSearch);
app.use("/api/food-stalls", foodRoutes);
app.use("/api/accommodation", accommodationRoutes);
app.use("/api/bus-search", busearch);
app.use("/api/chat",chatRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT)
})