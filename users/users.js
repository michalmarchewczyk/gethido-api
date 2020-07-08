const bcrypt = require('bcrypt');
const {validationMessages, validateUser} = require('./userValidation');
const logger = require('../middleware/logger');
const db = require('../db/db');
const cryptoRandomString = require('crypto-random-string');
const {HOST, PORT} = require('../mail/mailConfig');

const getUserId = async () => {
    let id = await db.Setting.findOneAndUpdate({name: "userId"}, {$inc: {'value': 1}});
    if (!id) return false;
    return id.value;
};


const registerUser = async ({username, email, password, repeatPassword}) => {
    
    const validUser = await validateUser({username, email, password, repeatPassword});
    if (validUser !== true) {
        logger.emit('user', `User not registered: ${validUser.map(err => err.type).join(', ')}`);
        return validUser;
    }
    
    const newUserId = await getUserId();
    
    const hash = await bcrypt.hash(password, 10);
    if (!hash) {
        logger.emit('error', `Bcrypt hash error`);
        return [validationMessages.error];
    }
    
    const newUser = new db.User({
        id: newUserId,
        username,
        email,
        password: hash,
        settings: {
            darkTheme: false,
            largeFont: false,
            emails: [],
            emailsPassword: cryptoRandomString({length: 20}),
        }
    });
    
    try {
        const saveUser = await newUser.save();
        
        logger.emit('user', `User registered: ${username}`);
        return [{...validationMessages.success, userId: saveUser.id}];
    } catch (err) {
        logger.emit('error', `User save error: ${err}`);
        return [validationMessages.error];
    }
};


const loginUser = async ({username, password}) => {
    
    const findUser = await db.User.find({username});
    if (findUser.length !== 1) {
        logger.emit('user', `Username not found: ${username}`);
        return [validationMessages.loginEx];
    }
    
    const passMatch = await bcrypt.compare(password, findUser[0].password);
    if (!passMatch) {
        logger.emit('user', `Wrong password: ${username}`);
        return [validationMessages.loginPass];
    }
    
    logger.emit('user', `User logged in: ${username}`);
    
    return {
        msg: [validationMessages.loginSuc],
        userId: findUser[0].id,
    }
};


const updateUser = async ({userId, oldPassword, updateData}) => {
    
    const findUser = await db.User.find({id: userId});
    if (findUser.length !== 1) {
        logger.emit('user', `User not found: ${userId}`);
        return [validationMessages.updateEx];
    }
    
    const passMatch = await bcrypt.compare(oldPassword, findUser[0].password);
    if (!passMatch) {
        logger.emit('user', `Wrong password: ${userId}`);
        return [validationMessages.updatePass];
    }
    
    const validUser = await validateUser(updateData, true);
    if (validUser !== true) {
        logger.emit('user', `User not updated: ${validUser.map(err => err.type).join(', ')}`);
        return validUser;
    }
    
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
    
    await db.User.updateOne({id: userId}, {...updateData}, {new: true});
    
    logger.emit('user', `User updated: ${userId}`);
    
    return [validationMessages.updateSuc];
};


const deleteUser = async ({userId, password}) => {
    const findUser = await db.User.find({id: userId});
    if (findUser.length !== 1) {
        logger.emit('user', `User not found: ${userId}`);
        return [validationMessages.error];
    }
    
    const passMatch = await bcrypt.compare(password, findUser[0].password);
    if (!passMatch) {
        logger.emit('user', `Wrong password: ${userId}`);
        return [validationMessages.updatePass];
    }
    
    await db.User.deleteOne({id: userId});
    
    logger.emit('user', `User deleted: ${userId}`);
    
    return [validationMessages.deleteSuc];
};


const getUser = async ({userId}) => {
    const user = await db.User.findOne({id: userId});
    if(!user) return false;
    return {
        id: userId,
        username: user.username,
        email: user.email,
    }
};


const checkUser = async ({userId}) => {
    const findUser = await db.User.find({id: userId});
    if (findUser.length !== 1) {
        logger.emit('user', `User not found: ${userId}`);
        return false;
    }
    return true;
};


const getUserSettings = async (userId) => {
    const settings = await db.User.find({id: userId});
    if (settings.length !== 1) return false;
    if (settings[0].settings) return settings[0].settings;
    return false;
};


const setUserSettings = async (userId, settings) => {
    let user = await db.User.find({id: userId});
    if (user.length !== 1) return false;
    
    user[0].settings = {
        ...user[0].settings,
        ...settings
    };
    user[0].save();
    
    return user[0].settings;
};


const getEmail = async (userId) => {
    const emails = await db.User.find({id: userId});
    if (emails.length !== 1) return false;
    if (emails[0].settings.emails) return emails[0].settings.emails;
    return false;
};


const setEmail = async (userId) => {
    let findUser = await db.User.find({id: userId});
    if (findUser.length !== 1) return false;
    let findEmails = findUser[0].settings.emails || [];
    
    let newEmail = `${userId}-${cryptoRandomString({length: 10})}@${HOST}`;
    
    while (findEmails.includes(newEmail) || findEmails.includes(`!${newEmail}`)) {
        newEmail = `${userId}-${cryptoRandomString({length: 10})}@${HOST}`;
    }
    
    let updated;
    if (findEmails.length < 1) {
        updated = await db.User.findOneAndUpdate({id: userId}, {'settings.emails': [newEmail]}, {new: true});
    } else {
        updated = await db.User.findOneAndUpdate({id: userId}, {$push: {'settings.emails': newEmail}}, {new: true});
    }
    
    if (!updated) return false;
    
    return newEmail;
};


const deleteEmail = async (userId, email) => {
    let deleted = await db.User.findOneAndUpdate({
        id: userId,
        'settings.emails': {$elemMatch: {$eq: email}}
    }, {$set: {'settings.emails.$': `!${email}`}}, {new: true});
    
    if (!deleted) return false;
    
    return deleted.settings.emails;
};


module.exports = {
    getUserId,
    registerUser,
    loginUser,
    getUserSettings,
    setUserSettings,
    updateUser,
    deleteUser,
    getUser,
    checkUser,
    getEmail,
    setEmail,
    deleteEmail,
};
