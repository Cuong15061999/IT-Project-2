// route middleware để kiểm tra một user đã đăng nhập hay chưa?
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const verify = promisify(jwt.verify).bind(jwt);
var secret = require('../secret.js')
const User = require('./../model/userModel')

require('dotenv').config();

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return jwt.sign({
      payload,
    },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife || '1h'
      });
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
}

const decodeToken = async (token, secretKey) => {
  try {
    return await verify(token, secretKey, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.log(`Error in decode access token: ${error}`);
    return null;
  }
}

class authServices {
  async register(req, res) {
    const username = req.body.username.toLowerCase();
    const userCheck = await User.findOne({ username: username });
    if (userCheck) {
      return res.status(409).send('Tên tài khoản đã tồn tại.');
    }
    else {
      const newUser = {
        username: username,
        password: hashPassword,
        email: req.body.email
      };
      const createUser = await new User(newUser).save();
      if (!createUser) {
        return res
          .status(500)
          .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
      }
      return res.send({
        username,
      });
    }
  }

  async login(req, res) {
    const email = req.body.email;
    var user = await User.findOne({ email: email });
    if (!user) {
      user = new User({
        email: req.body.email,
        name: req.body.name,
        image: req.body.picture,
        class: 'IT',
        falculty: 'IT',
      })
      .save();
    }

      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
      const accessTokenSecret = secret.cookieSecret;

      const dataForAccessToken = {
        user_id: user._id.toString(),
        email: user.email,
        picture: user.email,
        name: user.name,
        role: user.role
      };

      const accessToken = await generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
      );

      if (!accessToken) {
        return res
          .status(401)
          .send('Tạo access token không thành công, vui lòng thử lại.');
      }


      return res.json({
        msg: 'Đăng nhập thành công.',
        accessToken,
        user
      });

  }
}

module.exports = new authServices();