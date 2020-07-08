const express = require('express');
const {authorizeRequest} = require('../auth/userTokenAuth');
const {registerUserMiddleware, loginUserMiddleware, getUserSettingsMiddleware, setUserSettingsMiddleware, checkTokenMiddleware, logoutUserMiddleware, getTokenMiddleware, updateUserMiddleware, deleteUserMiddleware, getEmailMiddleware, setEmailMiddleware, deleteEmailMiddleware} = require('./usersMiddleware');
const router = express.Router();

router.post('/login', loginUserMiddleware);

router.post('/register', registerUserMiddleware);

router.put('/update', authorizeRequest, updateUserMiddleware);

router.delete('/delete', authorizeRequest, deleteUserMiddleware);

router.get('/checkToken', authorizeRequest, checkTokenMiddleware);

router.put('/logout', authorizeRequest, logoutUserMiddleware);

// router.get('/getToken', authorizeRequest, getTokenMiddleware);

router.get('/settings', authorizeRequest, getUserSettingsMiddleware);

router.put('/settings', authorizeRequest, setUserSettingsMiddleware);

router.get('/email', authorizeRequest, getEmailMiddleware);

router.put('/email', authorizeRequest, setEmailMiddleware);

router.delete('/email', authorizeRequest, deleteEmailMiddleware);

module.exports = router;
