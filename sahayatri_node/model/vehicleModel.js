const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleName :{
        type: String,
        required: true,
    }, 
    from:{
        type: String,
        required: true,
    },
    to:{
        type:String,
        required: true,
    },
    activation:{
        type:Boolean,
        required: false,
        default:true
    }
})

const Vehicles = mongoose.model('vehicles', vehicleSchema);
module.exports = Vehicles;