const Resource = require("../models/Resource");

// Get all resources
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one resource
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create resource
const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update resource
const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete resource
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
};