const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    organization: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        enum: [
            "Housing",
            "Food Assistance",
            "Workshop",
            "Student Support",
            "Healthcare",
            "Other"
        ],
        required: true,
    },

    borough: {
        type: String,
        enum: [
            "Bronx",
            "Brooklyn",
            "Manhattan",
            "Queens",
            "Staten Island",
            "Citywide"
        ],
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    link: {
        type: String,
    },

    contact: {
        type: String,
    },

    address: String,

    postcode: String,

    hours: String,

    latitude: Number,

    longitude: Number,

    sourceDataset: String,

    sourceId: {
        type: String,
        index: true,
    },

    sourceUrl: String,

    lastSyncedAt: Date,
},
{
    timestamps: true,
});

resourceSchema.index({ sourceDataset: 1, sourceId: 1 }, { unique: true, sparse: true });
resourceSchema.index({ category: 1, borough: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
