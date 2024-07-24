const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    vehicleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'vehicles',
        required: true
    }
    
});

const Notification =  mongoose.model('notifications',notificationSchema);
module.exports =  Notification;