const mongoose = require("mongoose");

const getSyncStatus = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const metadata = await db.collection("sync_metadata").find({}).sort({ lastSyncedAt: -1 }).toArray();

        const [resourceCount, opportunityCount] = await Promise.all([
            db.collection("resources").countDocuments(),
            db.collection("opportunities").countDocuments(),
        ]);

        res.status(200).json({
            collections: {
                resources: resourceCount,
                opportunities: opportunityCount,
            },
            datasets: metadata,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSyncStatus,
};
