const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} = require("../controllers/ResourceController");

router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.post("/", protect, createResource);

router.put("/:id", protect, updateResource);

router.delete("/:id", protect, deleteResource);
module.exports = router;