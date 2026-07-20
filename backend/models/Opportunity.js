const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    organization: String,

    category: {
        type: String,
        enum: [
            "Job",
            "Internship",
            "Scholarship",
            "Workshop",
            "Volunteer"
        ]
    },

    borough: String,

    description: String,

    link: String,

    deadline: Date,

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
        index: true
    },

    sourceUrl: String,

    lastSyncedAt: Date
},
{
    timestamps: true
}
);

opportunitySchema.index({ sourceDataset: 1, sourceId: 1 }, { unique: true, sparse: true });
opportunitySchema.index({ category: 1, borough: 1 });
opportunitySchema.index({ title: "text", organization: "text", description: "text", agency: "text" });

module.exports = mongoose.model("Opportunity", opportunitySchema);
