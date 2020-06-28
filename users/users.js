const bcrypt = require('bcrypt');
const { validationMessages, validateUser } = require('./userValidation');
const logger = require('../middleware/logger');
const db = require('../db/db');
const cryptoRandomString = require('crypto-random-string');

const getUserId = async () => {
    let id = await db.Setting.findOneAndUpdate({name: "userId"}, {$inc: {'value': 1}});
    if(!id) return false;
    return id.value;
};


const registerUser = async ({username, email, password, repeatPassword}) => {

    const validUser = await validateUser({username, email, password, repeatPassword});
    if(validUser !== true){
        logger.emit('user', `User not registered: ${validUser.map(err => err.type).join(', ')}`);
        return validUser;
    }

    const newUserId = await getUserId();

    const hash = await bcrypt.hash(password, 10);
    if(!hash) {
        logger.emit('error', `Bcrypt hash error`);
        return [validationMessages.error];
    }

    const newUser = new db.User({
        id: newUserId,
        username,
        email,
        password: hash,
    });

    try{
        const saveUser = await newUser.save();

        logger.emit('user', `User registered: ${username}`);
        return [{...validationMessages.success, userId: saveUser.id}];
    }catch (err){
        logger.emit('error', `User save error: ${err}`);
        return [validationMessages.error];
    }
};


const loginUser = async ({username, password}) => {

    const findUser = await db.User.find({username});
    if(findUser.length !== 1){
        logger.emit('user', `Username not found: ${username}`);
        return [validationMessages.loginEx];
    }

    const passMatch = await bcrypt.compare(password, findUser[0].password);
    if(!passMatch){
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
    if(findUser.length !== 1){
        logger.emit('user', `User not found: ${userId}`);
        return [validationMessages.updateEx];
    }

    const passMatch = await bcrypt.compare(oldPassword, findUser[0].password);
    if(!passMatch){
        logger.emit('user', `Wrong password: ${userId}`);
        return [validationMessages.updatePass];
    }

    const validUser = await validateUser(updateData, true);
    if(validUser !== true){
        logger.emit('user', `User not updated: ${validUser.map(err => err.type).join(', ')}`);
        return validUser;
    }

    if(updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);

    await db.User.updateOne({id: userId}, {...updateData}, {new: true});

    logger.emit('user', `User updated: ${userId}`);

    return [validationMessages.updateSuc];
};


const deleteUser = async ({userId, password}) => {
    const findUser = await db.User.find({id: userId});
    if(findUser.length !== 1){
        logger.emit('user', `User not found: ${userId}`);
        return [validationMessages.error];
    }

    const passMatch = await bcrypt.compare(password, findUser[0].password);
    if(!passMatch){
        logger.emit('user', `Wrong password: ${userId}`);
        return [validationMessages.updatePass];
    }

    await db.User.deleteOne({id: userId});

    logger.emit('user', `User deleted: ${userId}`);

    return [validationMessages.deleteSuc];
};


const checkUser = async ({userId}) => {
    const findUser = await db.User.find({id: userId});
    if(findUser.length !== 1){
        logger.emit('user', `User not found: ${userId}`);
        return false;
    }
    return true;
};


const getUserSettings = async (userId) => {
    const settings = await db.User.find({id: userId});
    if(settings.length !== 1) return false;
    if(settings[0].settings) return settings[0].settings;
    else return false;
};


const setUserSettings = async (userId, settings) => {
    let user = await db.User.find({id: userId});
    if(user.length !== 1) return false;

    user[0].settings = {
        ...user[0].settings,
        ...settings
    };
    user[0].save();

    return user[0].settings;
};


module.exports = {
    registerUser,
    loginUser,
    getUserSettings,
    setUserSettings,
    updateUser,
    deleteUser,
    checkUser,
};
