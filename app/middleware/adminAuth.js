const jwt = require('jsonwebtoken');
const tokenModel = require('../models/admintoken');

const adminToken = async(req, res, next ) => {
    const token = req.headers['token'];

    if(!token) {
        return res.status(401).send({status:"false",message : 'A token is Required For Authentication' });
    }

    try {
        var checkToken = await tokenModel.findOne({ token: token });

        if(checkToken) {
            const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);

            req.user = verify;
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({status:"false", message: "Invalid Token" });
    }
}

module.exports = adminToken;