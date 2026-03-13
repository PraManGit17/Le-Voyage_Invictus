const express = require("express");
const router = express.Router();

const {chatWithItinerary} = require("../controllers/chatController");

router.post("/chat",chatWithItinerary);

module.exports=router;