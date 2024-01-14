const userModel = require('../../model/userModel');
const authServices = require('../authServices');
require('dotenv').config();

exports.isAuth = async (req, res, next) => {

    const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authService.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
    if (!verified) {
		return res
			.status(401)
			.send('Bạn chưa được cấp quyền truy cập vào trang!');
	}
	const user = await userModel.find({username: verified.payload.username});
	req.user = user;

	return next();
}

exports.isAuthAdmin = async (req, res, next) => {

    const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authService.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	const checkAdmin = verified.payload.isAdmin;
    if (!verified && checkAdmin != 1) {
		return res
			.status(401)
			.send('Bạn chưa được cấp quyền truy cập vào trang!');
	}
	const user = await userModel.find({username: verified.payload.username});
	req.user = user;

	return next();
}