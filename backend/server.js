const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/supabase");

const authRoutes = require("./routes/authRoutes")
const aiRoutes = require("./routes/aiRoutes")



const app = express()



app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)


app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT)
})