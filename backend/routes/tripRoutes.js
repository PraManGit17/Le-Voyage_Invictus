const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMyTrips, createTrip, updateTrip } = require("../controllers/tripController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyTrips);
router.post("/", createTrip);
router.patch("/:tripId", updateTrip);

module.exports = router;