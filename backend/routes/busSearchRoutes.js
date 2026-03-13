const express = require("express");
const router = express.Router();

const { busSearchController } = require("../controllers/busSearchController");

router.post("/search-buses", busSearchController);

module.exports = router;