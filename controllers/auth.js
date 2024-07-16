import User from "/Projects/WebDev/dixies_system_backend/models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try{
        const {name, password} = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        const newUser = new User({name: name, password: hashPassword});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(409).json("message: " + err.message);
    }
}

export const signIn = async (req, res) => {
    try {
        const user = await User.findOne({name: req.body.name});
        if (!user) {
            return res.status(404).json("User not found");
        }

        const comparePasswords = await bcrypt.compare(req.body.password, user.password);
        if(!comparePasswords) {
            res.status(400).json("Incorrect password");
        }
        else {
            const age = 1000 * 60 * 60 * 24 * 7;
            user.password = '';
            delete user.password;
            const token = jwt.sign({
                id: user._id,
                isAdmin: true,
            }, process.env.JWT, {expiresIn: age});
            res.cookie("token", token, {
                httpOnly: true,
                // secure: true,
                maxAge: age,
            }).status(200).json(user)
        }
    }  catch (err) {
        res.status(500).json("message: " + err.message);
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json("Disconnected.")

    }  catch (err) {
        res.status(500).json("message: " + err.message);
    }
}
