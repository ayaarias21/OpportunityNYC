const Resource = require("../models/Resource");

const buildResourceQuery = (queryParams) => {
    const query = {};

    if (queryParams.type) {
        query.type = queryParams.type;
    }

    if (queryParams.borough) {
        query.borough = new RegExp(`^${queryParams.borough}$`, "i");
    }

    if (queryParams.q) {
        const regex = new RegExp(queryParams.q, "i");
        query.$or = [
            { title: regex },
            { description: regex },
            { address: regex },
            { borough: regex },
            { postcode: regex },
        ];
    }

    return query;
};

// Get all resources
const getAllResources = async (req, res) => {
    try {
        const query = buildResourceQuery(req.query);
        const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const skip = (page - 1) * limit;

        const [resources, total] = await Promise.all([
            Resource.find(query)
                .sort({ title: 1 })
                .skip(skip)
                .limit(limit),
            Resource.countDocuments(query),
        ]);

        res.status(200).json({
            data: resources,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
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
