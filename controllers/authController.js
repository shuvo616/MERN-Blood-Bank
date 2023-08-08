const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//Register Controller
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        //validation
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already exist"
            })
        }
        // bcrypt: hash password process
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //rest of the data saving process
        const user = new userModel(req.body)
        await user.save()
        return res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        });
    }
};

// Login Controller

const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials"
            })
        }
        //Check role
        if (user.role !== req.body.role) {
            return res.status(500).send({
                success: false,
                message: "Role dose not match"
            })
        }
        //Compare password
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        //validate password
        if (!comparePassword) {
            return res.status(500).send({
                success: false,
                message: "Invalid Credentials"
            })
        }
        // If password match then create JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.status(200).send({
            success: true,
            message: "Login Successful",
            token,
            user
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        });
    }
}

//Get Current User Controller

const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        return res.status(200).send({
            success: true,
            message: "User Fetched Successfully",
            user
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: "Unable to get current user",
            error
        })
    }
}

module.exports = { registerController, loginController, currentUserController }; 