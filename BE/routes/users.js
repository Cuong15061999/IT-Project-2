var express = require('express');
const userServices = require('../services/userServices')
var router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    const role = req.query.role; // Access the "role" parameter from the query string

    if (!role) { // No role specified, retrieve all users
      const users = await userServices.getUsers();
      res.status(200).json({
        data: users,
        message: 'Get all users',
      });
    } else if (role === "student" || role === "teacher") { 
      const users = await userServices.getUsersByRole(role);
      res.status(200).json({
        data: users,
        message: `Get ${role} users`,
      });
    } else { // Invalid role, send error response
      res.status(400).json({
        message: 'Invalid role provided',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* GET Specific user. */
router.get('/:id', async function (req, res, next) {
  try {
    const user = await userServices.getUser(req.params.id);
    if (user) {
      res.status(200).json({
        data: user,
        message: 'Get user with id: ' + req.params.id,
      });
    } else {
      res.status(404).json({
        message: 'Can not find user with id' + req.params.id,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});


/* Delete user. */
router.delete('/:id', async function (req, res, next) {
  try {
    const delUser = await userServices.delUser(req.params.id);
    if (delUser) {
      res.status(200).json({
        data: delUser,
        message: 'Del user with id: ' + req.params.id,
      });
    } else {
      res.status(200).json({
        message: 'Can not find user with id: ' + req.params.id,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

module.exports = router;
