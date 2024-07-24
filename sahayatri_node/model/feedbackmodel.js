const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedback :{
        type: String,
        required: true,
    }, 
    vehicleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vehicles',
        required : true
    },

    
})

const Feedback = mongoose.model('feedback', feedbackSchema);
module.exports = Feedback;