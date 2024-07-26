const router = require('express').Router();
const userController = require('../controllers/userControllers');
const { authGuard, checkAccountLockout, checkPasswordExpiry, validatePasswordStrength } = require('../middleware/authGuard');
const { auditCreate, auditUpdate, auditDelete } = require('../middleware/auditTrail');

// User registration route
router.post('/register', validatePasswordStrength, userController.createUser);

// User login route
router.post('/login', checkAccountLockout, checkPasswordExpiry, userController.loginUser);

// Other routes
router.get('/get_user/:id', authGuard, userController.getSingleUser);
router.post('/create_favourite', authGuard, auditCreate, userController.createFavourites);
router.get('/get_favourite/:id', authGuard, userController.getFavourites);
router.post('/create_feedback/:id', authGuard, auditCreate, userController.createFeedback);
router.delete('/delete_favourite/:id', authGuard, auditDelete, userController.deleteFavourite);

router.put('/update_user', authGuard, auditUpdate, userController.updateUserProfile);
router.delete('/delete_user', authGuard, auditDelete, userController.deleteUser);

// Forgot password route
router.post('/forgotPassword', userController.forgotPassword);

// Reset password route
router.put('/resetPassword/:token', userController.resetPassword);

module.exports = router;
