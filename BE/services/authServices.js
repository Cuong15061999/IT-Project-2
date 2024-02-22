// route middleware để kiểm tra một user đã đăng nhập hay chưa?
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const randToken = require('rand-token');
const User = require('./../model/userModel')

require('dotenv').config();

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign({
      payload,
    },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife
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
    // TODO : Giả dụ gửi vào đều là đúng 
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
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      const dataForAccessToken = {
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

      // let refreshToken = randToken.generate(process.env.REFRESH_TOKEN_SIZE);
      // if (!userCheck.refreshToken) {
      //   // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
      //   await userModel.updateOne({ username: username }, { refreshToken: refreshToken });
      // } else {
      //   refreshToken = userCheck.refreshToken;
      // }

      return res.json({
        msg: 'Đăng nhập thành công.',
        accessToken,
        user
      });


    // async refreshToken(req, res) {

    //   const accessTokenFromHeader = req.headers.x_authorization;
    //   if (!accessTokenFromHeader) {
    //     return res.status(400).send('Không tìm thấy access token.');
    //   }
    //   // Lấy refresh token từ body
    //   const refreshTokenFromBody = req.body.refreshToken;
    //   if (!refreshTokenFromBody) {
    //     return res.status(400).send('Không tìm thấy refresh token.');
    //   }
    //   const accessTokenSecret =
    //     process.env.ACCESS_TOKEN_SECRET;
    //   const accessTokenLife =
    //     process.env.ACCESS_TOKEN_LIFE;

    //   // Decode access token đó
    //   const decoded = await decodeToken(
    //     accessTokenFromHeader,
    //     accessTokenSecret,
    //   );
    //   if (!decoded) {
    //     return res.status(400).send('Access token không hợp lệ.');
    //   }
    //   // Lấy username từ payload
    //   const username = decoded.payload.username;
    //   const isAdmin = decoded.payload.isAdmin;
    //   const userCheck = await userModel.findOne({ username: username });
    //   if (!userCheck) {
    //     return res.status(401).send('User không tồn tại.');
    //   }

    //   if (refreshTokenFromBody !== userCheck.refreshToken) {
    //     return res.status(400).send('Refresh token không hợp lệ.');
    //   }

    //   const dataForAccessToken = {
    //     username,
    //     isAdmin
    //   };

    //   const accessToken = await generateToken(
    //     dataForAccessToken,
    //     accessTokenSecret,
    //     accessTokenLife,
    //   );

    //   if (!accessToken) {
    //     return res
    //       .status(400)
    //       .send('Tạo access token không thành công, vui lòng thử lại.');
    //   }
    //   return res.status(200).json({
    //     accessToken,
    //   });
    // }

    // async verifyToken (token, secretKey) {
    //   try {
    //     return await verify(token, secretKey);
    //   } catch (error) {
    //     console.log(`Error in verify access token:  + ${error}`);
    //     return null;
    //   }
    // }
  }
}

module.exports = new authServices();