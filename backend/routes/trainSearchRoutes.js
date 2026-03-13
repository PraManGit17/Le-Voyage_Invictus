const express = require("express");
const router = express.Router();

const { trainSearchController } = require("../controllers/trainSearchController");

router.post("/search", trainSearchController);

module.exports = router;