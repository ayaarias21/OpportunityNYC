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
            "Staten Island"
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
},
{
    timestamps: true,
});

module.exports = mongoose.model("Opportunity", opportunitySchema);