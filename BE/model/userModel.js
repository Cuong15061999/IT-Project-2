var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  role: { type: String, default: 'student' }, // student, teacher, admin
  class: String,
  falculty: String,
  created: { type: Date, required: true, default: new Date().toJSON().slice(0, 10) },
});

var User = mongoose.model('User', UserSchema);
module.exports = User;