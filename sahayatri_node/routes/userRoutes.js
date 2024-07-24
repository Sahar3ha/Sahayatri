const router = require('express').Router();
const userController = require('../controllers/userControllers');
const { authGuard, checkAccountLockout, checkPasswordExpiry, validatePasswordStrength } = require('../middleware/authGuard');

// User registration route
router.post('/register', validatePasswordStrength, userController.createUser);

// User login route
router.post('/login', checkAccountLockout, checkPasswordExpiry, userController.loginUser);

// Other routes
router.get('/get_user/:id', userController.getSingleUser);
router.post('/create_favourite', userController.createFavourites);
router.get('/get_favourite/:id', userController.getFavourites);
router.post('/create_feedback/:id', userController.createFeedback);
router.delete('/delete_favourite/:id', userController.deleteFavourite);

router.post('/update_user', authGuard, auditUpdate, userController.updateUser);
router.delete('/delete_user', authGuard, auditDelete, userController.deleteUser);
module.exports = router;
