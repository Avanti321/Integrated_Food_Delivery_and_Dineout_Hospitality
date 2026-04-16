import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// ─── Generate Token ───────────────────────────────────────────────────────────
// ✅ Now includes isAdmin so admin routes can verify role from token
const createToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET);
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // ✅ Pass isAdmin into the token
        const token = createToken(user._id, user.isAdmin);

        // ✅ Also return isAdmin to frontend so it can redirect to admin panel
        res.json({ success: true, token, isAdmin: user.isAdmin });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
            // isAdmin defaults to false for all new registrations
        });

        const user = await newUser.save();

        const token = createToken(user._id, user.isAdmin);
        res.json({ success: true, token, isAdmin: user.isAdmin });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };