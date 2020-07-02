const {loginUser, registerUser, getUserSettings, setUserSettings, updateUser, deleteUser, checkUser, getEmail, setEmail, deleteEmail} = require('./users');

let user_id;
let gen_email;

test('Registering user', async () => {
    let newUser = await registerUser({username: 'testingTempUser', email: 'testingTempEmail@localhost.test', password: 'Testing password', repeatPassword: 'Testing password'});
    
    expect(newUser).toBeTruthy();
    console.log(newUser);
    expect(typeof newUser[0].userId).toBe('number');
    expect(newUser[0].type).toBe('success');
    
    user_id = newUser[0].userId;
});


test('Logging in user', async () => {
   let user = await loginUser({username: 'testingTempUser', password: 'Testing password'});
   
   expect(user).toBeTruthy();
   expect(user.msg[0].type).toBe('loginSuc');
   expect(user.userId).toBe(user_id);
});


test('Updating user', async () => {
    let user = await updateUser({userId: user_id, oldPassword: 'Testing password', updateData: {username: 'newTestingUser', email: 'newTestingEmail@localhost.test', password: 'New testing password', repeatPassword: 'New testing password'}});
    
    expect(user).toBeTruthy();
    expect(user[0].type).toBe('updateSuc');
    
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

