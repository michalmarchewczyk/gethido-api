const {generateUserToken, verifyToken} = require('./userTokenAuth');

test('Generating token with given user data', async () => {
    let data = {
        username: "test"
    };
    let token = await generateUserToken(data);
    
    expect(token).toMatch(/\w*\.\w*\.\w*/);
    
    let tokenData = token.split('.');
    let algData = (new Buffer(tokenData[0], 'base64')).toString();
    
    expect(JSON.parse(algData)).toEqual({"alg": "RS512", "typ": "JWT"});
    
    let userData = (new Buffer(tokenData[1], 'base64')).toString();
    
    expect(JSON.parse(userData).username).toBe('test');
    
});

test('Token expiration time', async () => {
    let token = await generateUserToken({});
    const expirationTime = 36000;
    
    let tokenData = (new Buffer(token.split('.')[1], 'base64')).toString();
    
    expect(parseInt(JSON.parse(tokenData).exp) - parseInt(JSON.parse(tokenData).iat)).toBe(expirationTime);
});


test('Token validation', async() => {
    let data = {
        username: "qwerty"
    };
    let token = await generateUserToken(data);
    
    let userData = verifyToken(token);
    
    expect(userData).toBeTruthy();
    
    expect(userData.username).toBe(data.username);
});
