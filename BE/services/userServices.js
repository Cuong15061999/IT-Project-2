var userModel = require("../model/userModel");

class userServices {
  //Get all users in DB
  async getUsers() {
    return await userModel.find();
  }

  //Get user by roles
  async getUsersByRole(role) {
    return await userModel.find({role: role})
  }

  //Get specific user
  async getUser(id) {
    const user = await userModel.findById(id);
    return user;
  }

  //Edit User
  async editUser(req) {
    const finduser = await userModel.findOne({ _id: req.params.id })
    if (finduser) {
      await userModel.updateOne({ _id: req.params.id }, { $set: req.body });
      return req.body
    }
    return
  }

  //Delete user
  async delUser(id) {
    const user = await userModel.findOne({ _id: id });
    if (user) {
      await userModel.deleteOne({ _id: id })
      return user
    }
    return
  }
  
  appendSuffixToEmails(strings) {
    const suffix = "@student.tdtu.edu.vn";
    return strings.map(str => str + suffix);
}
}

module.exports = new userServices();