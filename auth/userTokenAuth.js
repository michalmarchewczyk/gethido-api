const {privateKey, publicKey} = require('./keys');
const jwt = require('jsonwebtoken');
const logger = require('../middleware/logger');

const verifyToken = (token) => {
    try {
        return jwt.verify(token, publicKey, {algorithms: ['RS512']});
    } catch (err) {
        return false;
    }
};

const authorizeRequest = async (req, res, next) => {
    const cookieToken = req.cookies.token;
    
    let token;
    
    if(cookieToken){
        token = cookieToken;
    }else{
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            logger.emit('user', `Authorization error`);
            res.set('WWW-Authenticate', 'Bearer');
            res.sendStatus(401);
            return;
        }
        token = bearerHeader.split(' ')[1];
    }
    
    const userData = verifyToken(token);
    
    if (userData) {
        logger.emit('user', `Token verified: ${userData.userId}`);
        req.userId = userData.userId;
        let newToken = await generateUserToken({userId: userData.userId});
        res.cookie('token', newToken, {httpOnly: true});
        next();
    } else {
        logger.emit('user', `Invalid token`);
        res.set('WWW-Authenticate', 'Cookie');
        res.clearCookie('token');
        res.sendStatus(401);
    }
};

const generateUserToken = async (userData) => {
    return jwt.sign(userData, privateKey, {expiresIn: '36000s', algorithm: "RS512"});
};

module.exports = {
    generateUserToken,
    authorizeRequest,
    verifyToken,
};
