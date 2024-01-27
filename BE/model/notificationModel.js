var mongoose = require('mongoose');

var NotifiCationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    eventId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String, required: true },
    notificationTime: { type: Date, required: true },
    created: { type: Date, required: true, default: new Date() },
});

var Notification = mongoose.model('Notification', NotifiCationSchema);
module.exports = Notification;