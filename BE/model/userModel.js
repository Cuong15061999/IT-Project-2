var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  role: { type: String, default: 'student' }, // student, teacher, admin
  class: { type: String, default: '170502' },
  falculty: { type: String, default: 'IT' },
  created: { type: Date, required: true, default: new Date().toJSON().slice(0, 10) },
});

UserSchema.index({ email: 1}, { unique: true });
UserSchema.index({ role: 1});

var User = mongoose.model('User', UserSchema);
module.exports = User;