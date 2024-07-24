const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    operation: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete']
    },
    collectionName: {
        type: String,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
