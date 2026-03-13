const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGroupTrip,
  getMyGroupTrips,
  joinGroupTrip,
  addPoolContribution,
} = require("../controllers/groupTripController");

const router = express.Router();

router.use(authMiddleware);

router.get("/mine", getMyGroupTrips);
router.post("/", createGroupTrip);
router.post("/:groupId/join", joinGroupTrip);
router.post("/:groupId/pool", addPoolContribution);

module.exports = router;
