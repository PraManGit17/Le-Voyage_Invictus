const express = require("express");
const router = express.Router();
const { getTopAttractions } = require("../controllers/aiController");

router.post("/attractions", getTopAttractions);

module.exports = router;
