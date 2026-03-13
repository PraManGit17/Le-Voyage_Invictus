const express = require("express");
const router = express.Router();

const { searchRestaurants } = require("../controllers/foodsearchController");

router.post("/", searchRestaurants);

module.exports = router;