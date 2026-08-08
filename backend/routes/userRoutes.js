const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
    getSavedOpportunities,
    saveOpportunity,
    unsaveOpportunity
} = require("../controllers/UserController");
const protect = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Current user
router.get("/me", protect, getCurrentUser);

// Saved opportunities
router.get("/saved", protect, getSavedOpportunities);
router.post("/saved/:opportunityId", protect, saveOpportunity);
router.delete("/saved/:opportunityId", protect, unsaveOpportunity);

module.exports = router;