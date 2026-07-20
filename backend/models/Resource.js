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

    website: String
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Resource", resourceSchema);