const Opportunity = require("../models/Opportunity");

const buildOpportunityQuery = (queryParams) => {
    const query = {};

    if (queryParams.category) {
        query.category = queryParams.category;
    }

    if (queryParams.borough) {
        query.borough = new RegExp(`^${queryParams.borough}$`, "i");
    }

    if (queryParams.q) {
        const regex = new RegExp(queryParams.q, "i");
        query.$or = [
            { title: regex },
            { organization: regex },
            { agency: regex },
            { description: regex },
            { borough: regex },
            { jobCategory: regex },
            { workLocation: regex },
        ];
    }

    return query;
};

// Get all opportunities
const getAllOpportunities = async (req, res) => {
    try {
        const query = buildOpportunityQuery(req.query);
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const skip = (page - 1) * limit;

        const [opportunities, total] = await Promise.all([
            Opportunity.find(query)
                .sort({ postingDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Opportunity.countDocuments(query),
        ]);

        res.status(200).json({
            data: opportunities,
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

// Get one opportunity
const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create opportunity
const createOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.create(req.body);
        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update opportunity
const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.status(200).json({ message: "Opportunity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
};
