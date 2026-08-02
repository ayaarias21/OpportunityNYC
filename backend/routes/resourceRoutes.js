const express = require("express");

const router = express.Router();

const {
    getResources,
    createResource
} = require("../controllers/ResourceController");

const protect = require("../middleware/authMiddleware");


router.get("/", getResources);


router.post("/", protect, createResource);


module.exports = router;