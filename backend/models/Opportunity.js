const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
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
            "Job",
            "Internship",
            "Scholarship",
            "Workshop",
            "Housing",
            "Food Assistance"
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

    deadline: {
        type: Date,
    },

    agency: String,

    workLocation: String,

    salaryRangeFrom: String,

    salaryRangeTo: String,

    salaryFrequency: String,

    salarySummary: String,

    employmentType: String,

    jobCategory: String,

    postingDate: Date,

    postingUpdated: Date,

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

opportunitySchema.index({ sourceDataset: 1, sourceId: 1 }, { unique: true, sparse: true });
opportunitySchema.index({ category: 1, borough: 1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);
