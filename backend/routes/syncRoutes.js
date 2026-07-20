const express = require("express");
const { getSyncStatus } = require("../controllers/SyncController");

const router = express.Router();

router.get("/status", getSyncStatus);

module.exports = router;
