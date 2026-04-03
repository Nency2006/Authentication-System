import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpmail.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedpassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" });

        verifyEmail(token, email)

        newUser.token = token;
        await newUser.save()
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const verifyUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "authorized token is missing" })
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "token expired" })
            }
            return res.status(401).json({ success: false, message: "invalid or expired token" })
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        user.token = null;
        user.isverified = true;
        await user.save();

        res.status(200).json({ success: true, message: "email verified successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        if (user.isverified !== true) {
            return res.status(403).json({ success: false, message: "Please verify your email first" })
        }

        // check for existing session or delete 

        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id });
        }

        // create a new session
        await Session.create({ userId: user._id });

        // Genrate token 
        const accessTocken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

        user.isLoggedIn = true;

        await user.save();

        res.status(200).json({ success: true, message: `Welcome back ${user.username}`, accessTocken, refreshToken, user });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        return res.status(200).json({ success: true, message: "Logged out successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOtpMail(email, otp);

        res.status(200).json({ success: true, message: "OTP sent to email" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const verifyOtp = async (req, res) => {

    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
        return res.status(400).json({ success: false, message: "OTP is required" })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: "OTP not found, please request for a new OTP" })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "OTP expired, please request for a new OTP" })
        }
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" })
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ success: true, message: "OTP verified successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

export const resetPassword = async (req, res) => {
    
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Email and new password are required" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password and confirm password do not match" })
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ success: true, message: "Password reset successfully" })
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }   
}