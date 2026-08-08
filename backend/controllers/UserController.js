const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, borough, interests } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            borough,
            interests
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                borough: user.borough,
                savedOpportunities: user.savedOpportunities
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                borough: user.borough,
                savedOpportunities: user.savedOpportunities
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get Current User
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                borough: user.borough,
                savedOpportunities: user.savedOpportunities
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get Saved Opportunities (full opportunity documents)
const getSavedOpportunities = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("savedOpportunities");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            data: user.savedOpportunities
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Save an Opportunity
const saveOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.params;

        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({
                message: "Opportunity not found"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { savedOpportunities: opportunityId } },
            { new: true }
        ).select("savedOpportunities");

        res.status(200).json({
            savedOpportunities: user.savedOpportunities
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Unsave an Opportunity
const unsaveOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.params;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { savedOpportunities: opportunityId } },
            { new: true }
        ).select("savedOpportunities");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            savedOpportunities: user.savedOpportunities
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Export controllers
module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    getSavedOpportunities,
    saveOpportunity,
    unsaveOpportunity
};