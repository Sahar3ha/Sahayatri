const Favourites = require("../model/favouritesModel")
const { find } = require("../model/favouritesModel")
const Feedback = require("../model/feedbackmodel")
const Notification = require("../model/notificationModel")
const Users = require("../model/userModel")
const Vehicles = require("../model/vehicleModel")

const createVehicle = async (req, res)=>{
    console.log(req.body)

    const {vehicleName,from,to,activation}=req.body
    if(!vehicleName || !from || !to){
        return res.json({
            success : false,
            message : "Please enter all fields."
        })
    }

    try{
    const newVehicle = new Vehicles({
        vehicleName : vehicleName,
        from : from,
        to : to,
        activation: activation
    })

    await newVehicle.save()
    res.json({
        success : true,
        message : "Vehicle added successfully"
    })
    }catch(error){
        console.log(error);
        res.status(500).json(error)
    }
}

const getAllVehicles = async(req ,res) =>{
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const listOfVehicles = await Vehicles.find().skip(skip).limit(limit);
        res.json({
            success: true,
            message : "All vehicles fetched",
            vehicles : listOfVehicles
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    }
}

const getActivatedVehicles = async(req ,res) =>{
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const listOfVehicles = await Vehicles.find({activation: true}).skip(skip).limit(limit);
        res.json({
            success: true,
            message : "All vehicles fetched",
            vehicles : listOfVehicles
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    }
}

const deleteVehicle = async(req,res)=>{
    try {
        const deleteVehicle = await Vehicles.findByIdAndDelete(req.params.id);
        await Favourites.findOneAndDelete({ vehicleId: req.params.id });
        await Notification.findOneAndDelete({ vehicleId: req.params.id });
        await Feedback.findOneAndDelete({ vehicleId: req.params.id });


        if(!deleteVehicle){
            return res.json({
                success:false,
                message:"Vehicle not found"
            })
        }
        res.json({
            success : true,
            message:"Vehicle deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
        
    }
}
const getSingleVehicle = async(req,res)=>{
    const id = req.params.id;
    if(!id){
        return res.json({
            success : false,
            message : "Vehicle ID is required!"
        })
    }
    try{
        const singleVehicle = await Vehicles.findById(id);
        res.json({
            success : true,
            message : "Vehicle fetched successfully",
            vehicle : singleVehicle
        })

    }catch(error){
        console.log(error);
        res.status(500).json("Server Error")

    }
}

const activation = async(req,res)=>{
    const vehicleid = req.params.id
    try {
        const vehicle = await Vehicles.findById(vehicleid);
        if(!vehicle){
            return res.json({
                success:false,
                message:'No vehicles found'
            })
        }
        vehicle.activation=true;
        await vehicle.save();
        
        res.json({
            success: true,
            message: 'Vehicle activated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
}

const deactivation = async(req,res)=>{
    const vehicleid = req.params.id
    try {
        const vehicle = await Vehicles.findById(vehicleid);
        if(!vehicle){
            return res.json({
                success:false,
                message:'No vehicles found'
            })
        }
        vehicle.activation=false;
        await vehicle.save();
        res.json({
            success: true,
            message: 'Vehicle deactivated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
}

const updateVehicle = async(req,res)=>{
    console.log(req.body);
    console.log(req.files);

    // destructuring
    const{
        vehicleName,
        from,
        to,
    }=req.body;


    // destructure id from url
    const id = req.params.id;


    // validation
    if(!vehicleName||!from||!to){
        res.json({
            success : false,
            message : "All fields are required"
        })
    }try {
        const updatedVehicle = {
        vehicleName : vehicleName,
        from : from,
        to : to,
        
        }
            await Vehicles.findByIdAndUpdate(id,updatedVehicle);
            await Favourites.findByIdAndUpdate(id,updatedVehicle.vehicleName);
            res.json({
                success : true,
                message : "Vehicle updated successfully",
                product : updatedVehicle
            })
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server error"
        })
    }

    
}
const getFeedback = async(req, res) =>{
    try {
        const feedbackdata = await Feedback.find().populate('vehicleId','vehicleName');
        res.json({
            success : true,
            message : "Feedbacks Fetched successfully",
            reviews : feedbackdata
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server error");
        
    }
}

const createNotification = async (req, res) => {
    console.log(req.body);
    const vehicleId = req.params.id;
  
    try {
      const notification = await Vehicles.findById(vehicleId);
      if (notification.activation === true) {
        return res.json({
          success: false,
          message: 'Vehicle active'
        });
      } else if (notification.activation === false) {
        const newNotification = new Notification({
          vehicleId: vehicleId
        });
        await newNotification.save();
        console.log(newNotification);
        return res.status(200).json({
          success: true,
          message: 'Notification created successfully',
          data: newNotification
        });
      } else {
        return res.json({
          success: false,
          message: 'No vehicles found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  };

  const getNotification = async(req,res)=> {
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;
        try {
            const vehicleData = await Notification.find().populate('vehicleId','vehicleName').skip(skip).limit(limit);
            res.json({
                success : true,
                message : "Notifications Fetched successfully",
                notification : vehicleData
            })
        } catch (error) {
            console.log(error)
            res.status(500).json("Server error");
            
        }  
  }
  const deleteNotification = async(req,res)=> {
    try {
        const vehicleData = await Notification.deleteMany();
        res.json({
            success : true,
            message : "Notifications Deleted successfully",
            notification : vehicleData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server error");
        
    }  
}

module.exports = {
    createVehicle,getAllVehicles,deleteVehicle,updateVehicle,getSingleVehicle,getFeedback,getActivatedVehicles,activation,deactivation,createNotification,getNotification,deleteNotification
}