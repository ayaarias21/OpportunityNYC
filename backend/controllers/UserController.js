const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser
};