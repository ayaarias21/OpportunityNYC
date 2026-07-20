const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
} = require("../controllers/OpportunityController");

router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

// Protected routes (requires JWT token)
router.post("/", protect, createOpportunity);
router.put("/:id", protect, updateOpportunity);
router.delete("/:id", protect, deleteOpportunity);

module.exports = router;