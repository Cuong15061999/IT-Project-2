var mongoose = require('mongoose');

var historyStudentSchema = new mongoose.Schema({
    eventId: { type: mongoose.Types.ObjectId, required: true, ref: 'Event' },
    userId: { type: mongoose.Types.ObjectId, default: null, ref: 'User' },
    emailUser: { type: String, required: false, default: '' },
    statusEvent: { type: String, required: false },
});

historyStudentSchema.index({ emailUser: 1, eventId: 1 }, { unique: true });

var historyStudent = mongoose.model('historyStudent', historyStudentSchema);
module.exports = historyStudent;