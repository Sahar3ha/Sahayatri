const AuditLog = require('../models/auditModel');
const User = require('../models/User'); // Adjust the path to your User model

const auditCreate = async (req, res, next) => {
    const { _id: userId } = req.user; // Assuming `req.user` contains the authenticated user
    const { collectionName, newValue } = req.body;

    const auditLog = new AuditLog({
        userId,
        operation: 'create',
        collectionName,
        documentId: newValue._id,
        newValue
    });

    try {
        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        next(error);
    }
};

const auditUpdate = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { collectionName, documentId, newValue } = req.body;

    try {
        const oldValue = await mongoose.model(collectionName).findById(documentId);

        const auditLog = new AuditLog({
            userId,
            operation: 'update',
            collectionName,
            documentId,
            oldValue,
            newValue
        });

        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        next(error);
    }
};

const auditDelete = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { collectionName, documentId } = req.body;

    try {
        const oldValue = await mongoose.model(collectionName).findById(documentId);

        const auditLog = new AuditLog({
            userId,
            operation: 'delete',
            collectionName,
            documentId,
            oldValue
        });

        await auditLog.save();
        next();
    } catch (error) {
        console.error('Audit log error:', error);
        next(error);
    }
};

module.exports = {
    auditCreate,
    auditUpdate,
    auditDelete
};
