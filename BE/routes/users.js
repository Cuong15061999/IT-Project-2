var express = require('express');
const userServices = require('../services/userServices')
var router = express.Router();

/* GET All user. */
router.get('/', async function (req, res, next) {
  try {
    const users = await userServices.getUsers();
    res.status(200).json({
      data: users,
      message: 'Get all user',
    });
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

/* ADD user. */
router.post('/', async function (req, res, next) {
  try {
    const addUser = await userServices.addUser(req);
    if (addUser) {
      res.status(200).json({
        data: addUser,
        message: 'Add user successfully',
      });
    } else {
      res.status(404).json({
        message: 'user already have',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

/* Edit user. */
router.put('/:id', async function (req, res, next) {
  try {
    const updateUser = await userServices.editUser(req);
    if (updateUser) {
      res.status(200).json({
        data: updateUser,
        message: 'Edit user with id:' + req.params.id,
      });
    } else {
      res.status(404).json({
        message: 'Can not find user with id:' + req.params.id,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
