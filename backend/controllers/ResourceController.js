const Resource = require("../models/Resource");

// Get resources
const getResources = async (req, res) => {
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
                }
            ];
        }

        const resources = await Resource.find(filter);

        res.status(200).json(resources);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Create resource
const createResource = async (req, res) => {
    try {

        const resource = await Resource.create(req.body);

        res.status(201).json(resource);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


module.exports = {
    getResources,
    createResource
};