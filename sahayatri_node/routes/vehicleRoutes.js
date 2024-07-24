const router  = require('express').Router();
const vehicleController = require("../controllers/vehicleControllers")
const {authGuard} = require('../middleware/authGuard');

router.post('/add_vehicles',vehicleController.createVehicle)
router.get('/get_vehicles',vehicleController.getAllVehicles)
router.get('/get_vehicle/:id',vehicleController.getSingleVehicle)
router.delete('/delete_vehicle/:id',authGuard,vehicleController.deleteVehicle)
router.put('/update_vehicle/:id',authGuard,vehicleController.updateVehicle)
router.get('/get_feedback',vehicleController.getFeedback)
router.get('/getActivatedVehicles',vehicleController.getActivatedVehicles)
router.patch('/activation/:id',vehicleController.activation)
router.patch('/deactivation/:id',vehicleController.deactivation)
router.post('/notification/:id',vehicleController.createNotification)
router.get('/get_notification/',vehicleController.getNotification)
router.delete('/delete_notification/',vehicleController.deleteNotification)


module.exports = router;