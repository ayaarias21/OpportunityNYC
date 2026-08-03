const express = require("express");

const router = express.Router();

const {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
} = require("../controllers/OpportunityController");

const protect = require("../middleware/authMiddleware");

router.get("/", getOpportunities);
router.post("/", protect, createOpportunity);
router.put("/:id", protect, updateOpportunity);
router.delete("/:id", protect, deleteOpportunity);

module.exports = router;
