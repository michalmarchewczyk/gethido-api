const { loginUser, registerUser, getUserSettings, setUserSettings, updateUser, deleteUser, checkUser, getEmail, setEmail, deleteEmail } = require('./users');
const { generateUserToken } = require('../auth/userTokenAuth');
const { validationMessages } = require('./userValidation');
const logger = require('../middleware/logger');


const registerUserMiddleware = async (req, res) => {
    logger.emit('user', `Registration attempt: ${req.body.username}, ${req.body.email}`);

    const {username, email, password, repeatPassword} = req.body;

    const user = {
        username,
        email,
        password,
        repeatPassword
    };

    let response = await registerUser(user);

    if(response[0] === validationMessages.userEx || response[0] === validationMessages.emailEx) res.status(409);
    else if(response[0] !== validationMessages.success) res.status(400);
    else res.status(201);

    res.json(response);
};


const loginUserMiddleware = async (req, res) => {
    logger.emit('user', `Login attempt: ${req.body.username}`);

    const { username, password } = req.body;

    let response = await loginUser({username, password});

    if(!response.userId){
        res.status(401);
        res.json(response);
        return;
    }

    let token = await generateUserToken({userId: response.userId});

    res.json({
        msg: response.msg,
        userId: response.userId,
        token: token,
    });
};


const updateUserMiddleware = async (req, res) => {
    logger.emit(`user`, `Update user data: ${req.userId}`);

    const { oldPassword, newUsername, newEmail, newPassword, newRepeatPassword } = req.body;

    if(!oldPassword) return res.sendStatus(400);

    let response;
    if(newUsername){
        response = await updateUser({ userId: req.userId, oldPassword, updateData: {username: newUsername}});
    }else if(newEmail){
        response = await updateUser({ userId: req.userId, oldPassword, updateData: {email: newEmail}});
    }else if(newPassword && newRepeatPassword && newPassword === newRepeatPassword){
        response = await updateUser({ userId: req.userId, oldPassword, updateData: {password: newPassword, repeatPassword: newRepeatPassword}});
    }else{
        res.sendStatus(400);
        return;
    }

    if(response[0] === validationMessages.userEx || response[0] === validationMessages.emailEx) res.status(409);
    else if(response[0] !== validationMessages.updateSuc) res.status(400);
    else res.status(200);

    res.json(response);
};


const deleteUserMiddleware = async (req, res) => {
    logger.emit(`user`, `Delete user: ${req.userId}`);

    const { password } = req.body;

    if(!password) return res.sendStatus(400);

    const response = await deleteUser({userId: req.userId, password});

    if(response[0] !== validationMessages.deleteSuc) res.status(400);
    else res.status(200);

    res.json(response);
};


const getTokenMiddleware = async (req, res) => {
    logger.emit(`user`, `Get new token: ${req.userId}`);

    let userEx = await checkUser({userId: req.userId});
    if(!userEx) return res.sendStatus(400);

    let token = await generateUserToken({userId: req.userId});

    res.json({
        userId: req.userId,
        token: token,
    });

    logger.emit('user', `Generated new token: ${req.userId}`);
};


const getUserSettingsMiddleware = async (req, res) => {
    const { userId } = req;

    const settings = await getUserSettings(userId);

    if(!settings) return res.sendStatus(400);

    res.json(settings);

    logger.emit('user', `Get settings: ${req.userId}`);
};


const setUserSettingsMiddleware = async (req, res) => {
    const { userId } = req;
    const settings = req.body;

    let newSettings = await setUserSettings(userId, settings);

    if(!newSettings) return res.sendStatus(500);

    res.json(newSettings);

    logger.emit('user', `Set settings: ${req.userId}`);
};


const getEmailMiddleware = async (req, res) => {
    const { userId } = req;

    let emails = await getEmail(userId);

    if(!emails) return res.sendStatus(500);

    res.json(emails);

    logger.emit('user', `Get email: ${req.userId}`);
};


const setEmailMiddleware = async (req, res) => {
    const { userId } = req;

    let email = await setEmail(userId);

    console.log(email);

    if(!email) return res.sendStatus(500);

    res.json(email);

    logger.emit('user', `Set email: ${req.userId}`);
};


const deleteEmailMiddleware = async (req, res) => {
    const { userId } = req;
    const { emailAddress } = req.body;

    if(!emailAddress) return res.sendStatus(400);

    let email = await deleteEmail(userId, emailAddress);

    if(!email) return res.sendStatus(400);

    res.json(email);

    logger.emit('user', `Delete email: ${req.userId}`);
};


module.exports = {
    loginUserMiddleware,
    registerUserMiddleware,
    getUserSettingsMiddleware,
    setUserSettingsMiddleware,
    getTokenMiddleware,
    updateUserMiddleware,
    deleteUserMiddleware,
    getEmailMiddleware,
    setEmailMiddleware,
    deleteEmailMiddleware,
};
