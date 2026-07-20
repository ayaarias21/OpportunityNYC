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

    deadline: Date
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Opportunity", opportunitySchema);