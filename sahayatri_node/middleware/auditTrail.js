const mongoose = require('mongoose');
const AuditLog = require('../model/auditModel');

const auditCreate = async (req, res, next) => {
    const { id: userId } = req.user; // Now req.user is the entire decoded token object
    const { collectionName, newValue } = req.body;

    console.log('Audit Create Middleware:', { userId, collectionName, newValue }); // Debug logging
    console.log('Request Body:', req.body);

    // Check for missing fields and log an error if necessary
    if (!collectionName || !newValue) {
        console.error('Audit log error: Missing collectionName or newValue', { collectionName, newValue });
        return res.json({ success: false, message: 'Missing collectionName or newValue in request body' });
    }
    if (!newValue._id) {
        newValue._id = newValue.vehicleId; // Example: Setting _id to vehicleId if _id is missing
    }

    const auditLog = new AuditLog({
        userId,
        operation: 'create',
        collectionName,
        documentId: newValue._id, // Ensure newValue has an _id field
        newValue
    });

    try {
        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        res.json({ success: false, message: 'Audit log error' });
    }
};


const auditUpdate = async (req, res, next) => {
    const { id: userId } = req.user; // Now req.user is the entire decoded token object
    const { firstName, lastName, email } = req.body;

    try {
        const user = await mongoose.model('Users').findById(userId); // Fetch the user by ID

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found for audit logging'
            });
        }

        const oldValue = { firstName: user.firstName, lastName: user.lastName, email: user.email };
        const newValue = { firstName, lastName, email };

        const auditLog = new AuditLog({
            userId,
            operation: 'update',
            collectionName: 'User',
            documentId: userId,
            oldValue,
            newValue
        });

        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        res.json({ success: false, message: 'Audit log error' });
    }
};

const auditDelete = async (req, res, next) => {
    const { id: userId } = req.user; // Now req.user is the entire decoded token object
    const { id } = req.params; // Assuming the document ID to delete is passed as a URL parameter

    try {
        const Model = mongoose.model('favourites'); // Replace 'Favourite' with the actual collection name if different
        const oldValue = await Model.findById(id);

        if (!oldValue) {
            return res.json({
                success: false,
                message: 'Document not found for audit logging'
            });
        }

        const auditLog = new AuditLog({
            userId,
            operation: 'delete',
            collectionName: 'Favourites',
            documentId: id,
            oldValue
        });

        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        res.json({ success: false, message: 'Audit log error' });
    }
};
module.exports = {
  auditCreate,
  auditUpdate,
  auditDelete
};
