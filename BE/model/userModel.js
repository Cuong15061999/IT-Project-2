var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: '' },
    refreshToken: { type: String, default: ''},
    isAdmin: { type: Number, default: 0},
    created: { type: Date, required: true, default: new Date().toJSON().slice(0, 10)},
});

var User = mongoose.model('User', UserSchema);
module.exports = User;