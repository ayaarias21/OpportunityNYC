const Opportunity = require("../models/Opportunity");

const getOpportunities = async (req, res) => {
    try {

        const { borough, category, search } = req.query;

        let filter = {};

        if (borough) {
            filter.borough = borough;
        }

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    organization: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const opportunities = await Opportunity.find(filter);

        res.status(200).json(opportunities);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Create opportunity
const createOpportunity = async (req, res) => {
    try {

        const opportunity = await Opportunity.create(req.body);

        res.status(201).json(opportunity);

    } catch (error) {

        res.status(400).json({
            message: error.message,
        });
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
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json(opportunity);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findByIdAndDelete(
            req.params.id
        );

        if (!opportunity) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        res.status(200).json({
            message: "Opportunity deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Export controllers
module.exports = {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
};