var mongoose = require('mongoose');
var StudentSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    name: String,
    class: String,
    falculty: String,
    image: String,
    role: String,
});

var Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
