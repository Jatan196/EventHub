import { User } from "../model/user.js";


export const signUp = async (req, res) => {
    const { name, email, phone, address, password, isGuestUser, organization, aadharNumber, gstNumber } = req?.body;
    console.log(req.body)
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
        console.log(userInfo)
        const newUser = new User(userInfo);

        const result = await newUser.save();

        console.log("Done");
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
    console.log(req.body)
    try {
        const currUser = await User.findOne({ email: email });

        if (currUser && currUser.password === password) {
            return res.status(200).json({ 
                id: currUser._id,
                isGuestUser: currUser.isGuestUser 
            });
        } else {
            return res.status(400).json({ message: "Bad auth" });
        }

    } catch (error) {
        return res.status(400).json({
            message: "error",
            error
        })
    }
}

export const signOut = async (req, res) => {
    try {
        // Clear any server-side session data if needed
        req.session = null;

        // Send response to clear client-side storage
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
