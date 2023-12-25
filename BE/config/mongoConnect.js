var mongoose = require('mongoose');
var User = require('../model/userModel');
// var Admin = require('../model/adminModel')
require('dotenv').config();
let env_ToDeploy = process.env.ENV;
let MongoUrl = process.env.MongoCN;

//Function Connect to Mongodb
const mongoconnect = {
  connectDB: function () {
    //check what env dev want to devploy 
    switch (env_ToDeploy) {
      case 'DEVELOPMENT':
        mongoose.connect(MongoUrl).then(() => {
          console.log('Database connected - Dev');
        });
        break;
      case 'PRODUCTION':
        mongoose.connect(MongoUrl).then(() => {
          console.log('Database connected - Product');
        });;
        break;
      default:
        throw new Error('Unknow execution environment: ' + app.get('env'));
    }

    //intial create first User in User Collection
    User.find().then((users) => {
      if (users.length) return;
      new User({
        username: 'admin',
        password: 'admin',
        email: 'admin@gmail.com',
      }).save()
      .then(() => {
        console.log('Create initial admin user for the project');
      })
      .catch((err) => {
        console.log(err);
      });
    })
  }
}
module.exports = mongoconnect