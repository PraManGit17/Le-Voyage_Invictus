const express = require("express");
const router = express.Router();

const { searchAccommodation } = require("../controllers/accommodationController");

router.post("/search", searchAccommodation);

module.exports = router;