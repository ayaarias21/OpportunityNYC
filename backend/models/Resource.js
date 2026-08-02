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

    contact: {
        type: String,
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("Resource", resourceSchema);