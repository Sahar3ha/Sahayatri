
const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Favourites = require("../model/favouritesModel")
const Feedback = require("../model/feedbackmodel")

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

const createFavourites = async(req,res) =>{
    const{userId,vehicleId}=req.body;
    if(!userId || !vehicleId ){
        return res.json({
            success : false,
            message : "All fields are required"
        })
    }
    try {

        const favourite = await Favourites.findOne({
            userId:userId,
            vehicleId:vehicleId
        }) 
        if(favourite){
            return res.json({
                success : false,
                message : "You've already added it"
            })
        }
        const favourites = new Favourites({
            userId : userId,
            vehicleId : vehicleId,
        })
        await favourites.save();
        res.status(200).json({
            success : true,
            message : "Added Favourite successfully",
            data : favourites
        })
        
    } catch (error) {
        console.log(error);    
        res.status(500).json({
            success : false,
            message : error
        })
        
    }
}


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
const deleteFavourite = async(req,res)=>{
    try {
        const deleteFavourite = await Favourites.findByIdAndDelete(req.params.id);
        if(!deleteFavourite){
            return res.json({
                success:false,
                message:"Not found"
            })
        }
        res.json({
            success : true,
            message:"Favourite Removed"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
        
    }
}

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
    const userId = req.params.id;
    console.log(req.body);
  
    const { firstName, lastName, email, password,} = req.body;
    if (!firstName || !lastName || !email) {
      return res.json({
        success: false,
        message: "Please enter all required fields."
      });
    }
  
    try {
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      if (service) {
        user.service = service;
        user.provider = true;
      }
  
      if (price !== undefined) {
        user.price = price;
      }
  
      await user.save();
  
      res.json({
        success: true,
        message: "User profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          ...(service && { service }),
          ...(price !== undefined && { price })
        }
      });
  
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };

module.exports = {
    createUser,loginUser,createFavourites,getFavourites,getSingleUser,createFeedback,deleteFavourite,deleteUser,updateUserProfile
}