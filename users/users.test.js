const {getUserId, loginUser, registerUser, getUserSettings, setUserSettings, updateUser, deleteUser, checkUser, getEmail, setEmail, deleteEmail} = require('./users');
const logger = require('../middleware/logger');
logger.emit('log', 'Testing users');

let user_id;
let gen_email;

test('Registering user', async () => {
    let newUser = await registerUser({username: 'testingTempUser', email: 'testingTempEmail@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    
    expect(newUser).toBeTruthy();
    expect(typeof newUser[0].userId).toBe('number');
    expect(newUser[0].type).toBe('success');
    
    user_id = newUser[0].userId;
});


test('Registration username validation', async () => {
    let newUser = await registerUser({username: '', email: 'testingTempEmail2@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('userReq');
    
    newUser = await registerUser({username: '12', email: 'testingTempEmail2@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('userLen');
    
    newUser = await registerUser({username: '1234567890123456789012345678901234567890123', email: 'testingTempEmail2@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('userMax');
    
    newUser = await registerUser({username: 'asfsafd asfsaf', email: 'testingTempEmail2@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('userVal');
    
    newUser = await registerUser({username: 'testingTempUser', email: 'testingTempEmail2@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('userEx');
    
});


test('Registration email validation', async () => {
    let newUser = await registerUser({username: 'testingTempUser2', email: '', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('emailReq');
    
    newUser = await registerUser({username: 'testingTempUser2', email: 'testingTempEmail', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('emailVal');
    
    
    newUser = await registerUser({username: 'testingTempUser2', email: 'testingTempEmail@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('emailEx');
    
});


test('Registration password validation', async () => {
    let newUser = await registerUser({username: 'testingTempUser2', email: 'testingTempEmail2@localhost.test', password: '', repeatPassword: ''});
    expect(newUser[0].type).toBe('passReq');
    
    newUser = await registerUser({username: 'testingTempUser2', email: 'testingTempEmail2@localhost.test', password: '123456', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('passLen');
    
    
    newUser = await registerUser({username: 'testingTempUser2', email: 'testingTempEmail@localhost.test', password: '123456789', repeatPassword: 'Testing password'});
    expect(newUser[0].type).toBe('passMatch');
    
});


test('Checking if user exists', async () => {
    let user = await checkUser({userId: user_id});
    
    expect(user).toBe(true);
});


test('Checking database value for user id', async () => {
    let id = await getUserId();
    
    expect(typeof id).toBe('number');
    expect(id - user_id).toBe(1);
});


test('Logging in user', async () => {
   let user = await loginUser({username: 'testingTempUser', password: 'Testing password'});
   
   expect(user).toBeTruthy();
   expect(user.msg[0].type).toBe('loginSuc');
   expect(user.userId).toBe(user_id);
});


test('Logging in user with wrong username', async () => {
    let user = await loginUser({username: 't', password: 'Testing password'});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('loginEx');
});


test('Logging in user with wrong password', async () => {
    let user = await loginUser({username: 'testingTempUser', password: 'password'});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('loginPass');
});


test('Updating user', async () => {
    let user = await updateUser({userId: user_id, oldPassword: 'Testing password', updateData: {username: 'newTestingUser', email: 'newTestingEmail@localhost.test', password: 'New testing password', repeatPassword: 'New testing password'}});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('updateSuc');
    
});


test('Updating user with wrong id', async () => {
    let user = await updateUser({userId: 0, oldPassword: 'Testing password', updateData: {username: 'newTestingUser', email: 'newTestingEmail@localhost.test', password: 'New testing password', repeatPassword: 'New testing password'}});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('updateEx');
    
});


test('Updating user with wrong password', async () => {
    let user = await updateUser({userId: user_id, oldPassword: 'password', updateData: {username: 'newTestingUser', email: 'newTestingEmail@localhost.test', password: 'New testing password', repeatPassword: 'New testing password'}});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('updatePass');
    
});


test('Logging in user with new data', async () => {
    let user = await loginUser({username: 'newTestingUser', password: 'New testing password'});
    
    expect(user).toBeTruthy();
    expect(user.msg[0].type).toBe('loginSuc');
    expect(user.userId).toBe(user_id);
});


test('Getting user settings', async () => {
    let settings = await getUserSettings(user_id);
    
    expect(settings).toBeTruthy();
    expect(settings.darkTheme).toBe(false);
    expect(settings.emails.length).toBe(0);
    expect(typeof settings.emailsPassword).toBe('string');
    
});


test('Setting user settings', async () => {
    let settings = await setUserSettings(user_id, {darkTheme: true});
    
    expect(settings).toBeTruthy();
    expect(settings.darkTheme).toBe(true);
});


test('Generating user email', async () => {
    let email = await setEmail(user_id);
    
    expect(email).toBeTruthy();
    let regex = new RegExp(`${user_id}-\\w*@.*`);
    expect(email).toMatch(regex);
    
    gen_email = email;
});


test('Getting user emails', async () => {
    let emails = await getEmail(user_id);
    
    expect(emails).toBeTruthy();
    expect(emails.length).toBe(1);
    expect(emails[0]).toBe(gen_email);
});


test('Deleting user email', async () => {
    let emails = await deleteEmail(user_id, gen_email);
    
    expect(emails).toBeTruthy();
    expect(emails.length).toBe(1);
    expect(emails[0]).toBe(`!${gen_email}`);
    
});


test('Deleting user', async () => {
    let user = await deleteUser({userId: user_id, password: 'New testing password'});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('deleteSuc');
});

