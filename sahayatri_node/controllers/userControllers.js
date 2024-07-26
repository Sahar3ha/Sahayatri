
const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const jwt = require("jsonwebtoken")
const Favourites = require("../model/favouritesModel")
const Feedback = require("../model/feedbackmodel")
const sendEmail =  require("../middleware/sendEmail")
// Utility function to validate password complexity
const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 12;
    const complexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    if (password.length < minLength || password.length > maxLength) {
        return { valid: false, message: 'Password must be between 8 and 12 characters long.' };
    }

    if (!complexityPattern.test(password)) {
        return { valid: false, message: 'Password must include uppercase, lowercase, number, and special character.' };
    }

    return { valid: true };
};

// Utility function to check password history
const checkPasswordHistory = async (userId, newPassword) => {
    const user = await User.findById(userId);
    for (const oldPassword of user.passwordHistory) {
        const isMatch = await bcrypt.compare(newPassword, oldPassword);
        if (isMatch) {
            return false;
        }
    }
    return true;
};

// Utility function to assess password strength (for real-time feedback)
const assessPasswordStrength = (password) => {
    const strength = {
        0: "Weak",
        1: "Fair",
        2: "Good",
        3: "Strong"
    };
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    return strength[score > 3 ? 3 : score];
};

// Updated createUser function with enhanced features
const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.json({
            success: false,
            message: 'Please enter all fields.'
        });
    }

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return res.json({
            success: false,
            message: passwordValidation.message
        });
    }

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists.'
            });
        }

        const generateSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, generateSalt);

        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: encryptedPassword,
            passwordHistory: [encryptedPassword],
            passwordChangedAt: new Date(),
            loginAttempts: 0,
            lockUntil: null
        });

        await newUser.save();

        res.json({
            success: true,
            message: 'User created successfully.'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)

    try {
        console.log('Received login request for email:', email);

        const user = await Users.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.json({
                success: false,
                message: 'User not found.'
            });
        }

        console.log('User found:', user);

        if (user.isLocked) {
            return res.json({
                success: false,
                message: `Account is locked. Please try again later. It will be unlocked at ${user.lockUntil}.`,
                lockUntil: user.lockUntil
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginAttempts += 1;
            let lockMessage = '';
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // lock for 30 minutes
                lockMessage = ` Your account is now locked until ${user.lockUntil}.`;
            }
            await user.save();

            return res.json({
                success: false,
                message: `Invalid credentials. You have ${5 - user.loginAttempts} attempts left.${lockMessage}`,
                remainingAttempts: 5 - user.loginAttempts,
                lockUntil: user.lockUntil
            });
        }

        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            token,
            userData: user
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Server error.' });
    }
};


const getSingleUser= async(req,res)=>{
    const id = req.params.id;
    if(!id){
        return res.json({
            success : false,
            message : "User ID is required!"
        })
    }
    try{
        const user = await Users.findById(id);
        res.json({
            success : true,
            message : "User fetched successfully",
            user : user
        })

    }catch(error){
        console.log(error);
        res.status(500).json("Server Error")

    }
}

const createFavourites = async (req, res) => {
    const { collectionName, newValue } = req.body;
    const { userId, vehicleId } = newValue;

    try {
        const favourite = new Favourites({
            userId,
            vehicleId
        });

        await favourite.save();

        res.json({
            success: true,
            message: 'Favourite created successfully',
            favourite
        });
    } catch (error) {
        console.error('Error creating favourite:', error);
        res.json({
            success: false,
            message: 'Error creating favourite'
        });
    }
};



const getFavourites = async(req, res) =>{
    const userId = req.params.id;
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const favourites = await Favourites.find({
            userId : userId
        }).populate('vehicleId','vehicleName').skip(skip).limit(limit);
        res.json({
            success : true,
            message : "Favourites Fetched successfully",
            favourites : favourites
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server error");
        
    }
}
const deleteFavourite = async (req, res) => {
    const { id } = req.params;

    try {
        const favourite = await Favourites.findById(id);

        if (!favourite) {
            return res.json({
                success: false,
                message: 'Favourite not found'
            });
        }

        await favourite.deleteOne();

        res.json({
            success: true,
            message: 'Favourite deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting favourite:', error);
        res.json({
            success: false,
            message: 'Error deleting favourite'
        });
    }
};

    const createFeedback = async(req,res)=>{
        const vehicleId = req.params.id;

        console.log(req.body)
        const{feedback}=req.body;
        if(!feedback){
            return res.json({
                success : false,
                message : "All fields are required"
            })
        }
        try {
            const newfeedback = new Feedback({
                vehicleId : vehicleId,
                feedback : feedback,
            })
            await newfeedback.save();
            res.status(200).json({
                success : true,
                message : "Added successfully",
                data : newfeedback
            })
            
        } catch (error) {
            console.log(error);    
            res.status(500).json({
                success : false,
                message : error
            })
            
        }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await Users.findByIdAndDelete(userId);
        await Favourites.deleteMany({ providerId:userId });
        await Feedback.deleteMany({ providerId:userId });
  
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
  };
  const updateUserProfile = async (req, res) => {
    const { id: userId } = req.user;
    const { firstName, lastName, email } = req.body;

    try {
        const user = await Users.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

  const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found.'
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set the reset token in the database
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

        // Send the email
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.json({
            success: true,
            message: 'Email sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.json({ success: false, message: 'Server error.' });
    }
};

const resetPassword = async (req, res) => {
    const resetToken = req.params.token;

    // Hash the token and compare it to the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    try {
        const user = await Users.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid token or token has expired.'
            });
        }

        // Set the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.json({ success: false, message: 'Server error.' });
    }
};


module.exports = {
    createUser,loginUser,createFavourites,getFavourites,getSingleUser,createFeedback,deleteFavourite,deleteUser,updateUserProfile,forgotPassword,resetPassword
}