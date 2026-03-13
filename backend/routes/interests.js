const express = require("express");
const router = express.Router();

const { saveInterests } = require("../controllers/interestsController");

router.post("/interests", saveInterests);
