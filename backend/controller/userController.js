import { User } from "../model/user.js";
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
    const { name, email, phone, address, password, isGuestUser, organization, aadharNumber, gstNumber } = req?.body;
    try {
        const userInfo = {
            name,
            email,
            phone,
            address,
            password,
            isGuestUser,
            organization,
            aadharNumber,
            gstNumber
        }
        const newUser = new User(userInfo);
        const result = await newUser.save();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: "Not registered",
            error
        })
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req?.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                success: false, 
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { 
                userId: user._id,
                isGuestUser: user.isGuestUser 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(200).json({ 
            success: true,
            userId: user._id,
            isGuestUser: user.isGuestUser,
            token: token
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        })
    }   
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        return res.status(200).json({
            success: true,
            message: "Successfully logged out"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error during logout",
            error: error.message
        });
    }
};
