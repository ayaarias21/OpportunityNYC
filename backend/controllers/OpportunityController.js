const Opportunity = require("../models/Opportunity");

// Get all opportunities
const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find();
        res.status(200).json(opportunities);
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