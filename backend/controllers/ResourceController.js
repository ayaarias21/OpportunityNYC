const Resource = require("../models/Resource");

const normalizeCategory = (queryParams) => {
    if (queryParams.category) {
        return queryParams.category;
    }

    if (queryParams.type === "Food") {
        return "Food Assistance";
    }

    return queryParams.type;
};

const buildResourceFilter = (queryParams) => {
    const filter = {};

    const category = normalizeCategory(queryParams);
    if (category) {
        filter.category = category;
    }

    if (queryParams.borough) {
        filter.borough = queryParams.borough;
    }

    const searchTerm = queryParams.search || queryParams.q;
    if (searchTerm) {
        filter.$or = [
            { title: { $regex: searchTerm, $options: "i" } },
            { organization: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { address: { $regex: searchTerm, $options: "i" } },
            { borough: { $regex: searchTerm, $options: "i" } },
            { postcode: { $regex: searchTerm, $options: "i" } },
        ];
    }

    return filter;
};

const getResources = async (req, res) => {
    try {
        const filter = buildResourceFilter(req.query);
        const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const skip = (page - 1) * limit;
        const usePagination = Boolean(req.query.limit || req.query.page);

        const query = Resource.find(filter)
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit);

        if (usePagination) {
            const [resources, total] = await Promise.all([
                query,
                Resource.countDocuments(filter),
            ]);

            return res.status(200).json({
                data: resources,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit) || 1,
                },
            });
        }

        const resources = await Resource.find(filter).sort({ title: 1 });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getResources,
    createResource,
};
