const validator = require('validator');
const db = require('../db/db');

const validationMessages = {
    userReq: {type: "userReq", msg: "username is required"},
    userLen: {type: "userLen", msg: "username must be at least 4 characters long"},
    userMax: {type: "userMax", msg: "username cannot be longer than 40 characters"},
    userVal: {type: "userVal", msg: "username can contain only alphanumeric characters"},
    userEx: {type: "userEx", msg: "this username is already taken"},
    emailReq: {type: "emailReq", msg: "email address is required"},
    emailVal: {type: "emailVal", msg: "wrong email address"},
    emailEx: {type: "emailEx", msg: "this email is already registered"},
    passReq: {type: "passReq", msg: "password is required"},
    passLen: {type: "passLen", msg: "password must be at lest 8 characters long"},
    passMatch: {type: "passMatch", msg: "passwords don't match"},
    success: {type: "success", msg: "user created successfully"},
    error: {type: "error", msg: "unknown error, please try again later"},
    loginEx: {type: "loginEx", msg: "user doesn't exists"},
    loginPass: {type: "loginPass", msg: "wrong password"},
    loginSuc: {type: "loginSuc", msg: "login successful"},
    updateEx: {type: "updateEx", msg: "user doesn't exists"},
    updatePass: {type: "updatePass", msg: "wrong password"},
    updateSuc: {type: "updateSuc", msg: "updated successfully"},
    deleteSuc: {type: "deleteSuc", msg: "user deleted"},
};

const validateUsername = (username) => {
    if (!username) return validationMessages.userReq;
    if (username.length < 4) return validationMessages.userLen;
    if (username.length > 40) return validationMessages.userMax;
    if (!validator.isAlphanumeric(username)) return validationMessages.userVal;
    return true;
};

const validateEmail = (email) => {
    if (!email) return validationMessages.emailReq;
    if (!validator.isEmail(email)) return validationMessages.emailVal;
    return true;
};

const validatePassword = (password, repeatPassword) => {
    if (!password) return validationMessages.passReq;
    if (password.length < 8) return validationMessages.passLen;
    if (password !== repeatPassword) return validationMessages.passMatch;
    return true;
};

const validateUser = async ({username, email, password, repeatPassword}, ignoreMissing = false) => {
    
    const validationErrors = [];
    
    const validUsername = validateUsername(username);
    if (validUsername !== true && !(ignoreMissing && !username)) {
        validationErrors.push(validUsername);
    }
    
    const validEmail = validateEmail(email);
    if (validEmail !== true && !(ignoreMissing && !email)) {
        validationErrors.push(validEmail);
    }
    
    const validPassword = validatePassword(password, repeatPassword);
    if (validPassword !== true && !(ignoreMissing && !password)) {
        validationErrors.push(validPassword);
    }
    
    if (validationErrors.length !== 0) return validationErrors;
    
    let findUsername = await db.User.find({username});
    
    let findEmail = await db.User.find({email});
    
    if (findUsername.length !== 0) {
        validationErrors.push(validationMessages.userEx);
    }
    
    if (findEmail.length !== 0) {
        validationErrors.push(validationMessages.emailEx);
    }
    
    if (validationErrors.length === 0) {
        return true
    } else {
        return validationErrors;
    }
};

module.exports = {
    validationMessages,
    validateUser,
};
