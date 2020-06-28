const express = require('express');
const { authorizeRequest } = require('../auth/userTokenAuth');
const { registerUserMiddleware, loginUserMiddleware, getUserSettingsMiddleware, setUserSettingsMiddleware, getTokenMiddleware, updateUserMiddleware, deleteUserMiddleware } = require('./usersMiddleware');
const router = express.Router();

router.post("/login", loginUserMiddleware);

router.post("/register", registerUserMiddleware);

router.put("/update", authorizeRequest, updateUserMiddleware);

router.delete("/delete", authorizeRequest, deleteUserMiddleware);

router.get("/checkToken", authorizeRequest, (req, res) => {
    res.json({
        msg: "You are logged in",
        userId: req.userId,
    });
});

router.get('/getToken', authorizeRequest, getTokenMiddleware);

router.get("/settings", authorizeRequest, getUserSettingsMiddleware);

router.put("/settings", authorizeRequest, setUserSettingsMiddleware);

module.exports = router;
