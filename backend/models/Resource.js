const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
{
    title: String,

    type: {
        type: String,
        enum: [
            "Housing",
            "Food",
            "Healthcare",
            "Education",
            "Legal"
        ]
    },

    borough: String,

    description: String,

    address: String,

    phone: String,

    website: String,

    postcode: String,

    hours: String,

    latitude: Number,

    longitude: Number,

    sourceDataset: String,

    sourceId: {
        type: String,
        index: true
    },

    sourceUrl: String,

    lastSyncedAt: Date
},
{
    timestamps: true
}
);

resourceSchema.index({ sourceDataset: 1, sourceId: 1 }, { unique: true, sparse: true });
resourceSchema.index({ type: 1, borough: 1 });
resourceSchema.index({ title: "text", description: "text", address: "text" });

module.exports = mongoose.model("Resource", resourceSchema);
