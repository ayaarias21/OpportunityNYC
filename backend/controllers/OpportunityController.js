const Opportunity = require("../models/Opportunity");

const buildOpportunityFilter = (queryParams) => {
    const filter = {};

    if (queryParams.borough) {
        filter.borough = queryParams.borough;
    }

    if (queryParams.category) {
        filter.category = queryParams.category;
    }

    if (queryParams.careerLevel) {
        filter.careerLevel = queryParams.careerLevel;
    }

    const searchTerm = queryParams.search || queryParams.q;
    if (searchTerm) {
        filter.$or = [
            { title: { $regex: searchTerm, $options: "i" } },
            { organization: { $regex: searchTerm, $options: "i" } },
            { agency: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { borough: { $regex: searchTerm, $options: "i" } },
            { jobCategory: { $regex: searchTerm, $options: "i" } },
            { workLocation: { $regex: searchTerm, $options: "i" } },
        ];
    }

    return filter;
};

const getOpportunities = async (req, res) => {
    try {
        const filter = buildOpportunityFilter(req.query);
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const skip = (page - 1) * limit;
        const usePagination = Boolean(req.query.limit || req.query.page);

        const query = Opportunity.find(filter)
            .sort({ postingDate: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (usePagination) {
            const [opportunities, total] = await Promise.all([
                query,
                Opportunity.countDocuments(filter),
            ]);

            return res.status(200).json({
                data: opportunities,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit) || 1,
                },
            });
        }

        const opportunities = await Opportunity.find(filter)
            .sort({ postingDate: -1, createdAt: -1 });

        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.create(req.body);
        res.status(201).json(opportunity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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

const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.status(200).json({ message: "Opportunity deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                message: "Opportunity not found",
            });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
};
