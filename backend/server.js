const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const aiRoutes = require("./routes/airoutes")
const travelRoutes = require("./routes/travelRoutes")
const planTripRoutes = require("./routes/planTripRoutes");
const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api", travelRoutes);
app.use("/api/trip", planTripRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT)
})