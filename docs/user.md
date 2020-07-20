# User API

This part of API is responsible for registering, authenticating and authorizing users.

Endpoints have the form: **https://[URL]/user/[endpoint]**


## Token authorization

Most user action require user to authenticate with JWT token.

Token can be sent in a cookie:

```Cookie: token=[token]```
 
or in authorization header:
 
```Authorization: Bearer [token]```

Tokens automatically expire after 10 hours.

With each request there is a new token send with new expiration time.

Attempt to authorize with invalid or expired token will result in response with code **401 UNAUTHORIZED**


## Error types

### Registration errors
 - userReq - Username is required
 - userLen - Username must be at least 4 characters long
 - userMax - Username cannot be longer than 40 characters
 - userVal - Username can contain only alphanumeric characters
 - userEx - Username is already taken
 - emailReq - Email address is required
 - emailVal - Wrong email address
 - emailEx - Email address is already registered
 - passReq - Password is required
 - passLen - Password must be at least 8 characters long
 - passMatch - Password and repeatPassword don't match
 - success - User created successfully
 
### Login errors
 - loginEx - Username is not registered
 - loginPass - Wrong password
 - loginSuc - Login successful
 
 ### Other errors
 - updateEx - Username is not registered
 - updatePass - Wrong password
 - updateSuc - User updated successfully
 - deleteSuc - User deleted successfully
 - error - Unknown error


## Register user

- **URL**

    ```POST /user/register```
    
- **Body**
    ```
    username=[username]
    email=[email address]
    password=[password]
    repeatPassword=[repeatPassword]
    ```

- **Success response**
    - Code: 201 CREATED
    - Content: 
        ```json
        [
          {
            "type": "success",
            "msg": "user created successfully",
            "userId": ["userId"]
          }
        ] 
        ```
      
      
- **Error response**
    - Code:  409 CONFLICT
    - Content:
        Array of errors in the form: ```{type: [error type], msg: [error message]}```
        Example:
        ```json
        [
          {
            "type": "userEx",
            "msg": "this username is already taken"
          },
          {
            "type": "emailEx",
            "msg": "this email is already registered"
          }
        ]
        ```
    OR
    - Code:  400 BAD REQUEST
    - Content:
        Array of errors in the form: ```{type: [error type], msg: [error message]}```
        Example:
        ```json
        [
          {
            "type": "userReq",
            "msg": "username is required"
          },
          {
            "type": "emailReq",
            "msg": "email address is required"
          }
        ]
        ```
      
      
## Login user

- **URL**

    ```POST /user/login```
    
- **Body**
    ```
    username=[username]
    password=[password]
    ```

- **Success response**
    - Code: 200 OK
    - Content: 
        ```json
        {
          "msg": [
            {
              "type": "loginSuc",
              "msg": "login successful"
            }
          ],
          "user": {
            "id": ["userId"],
            "username": ["username"]
          }
        }
        ```
    - Set-Cookie header:
        ```
        token=[token]; Path=/; HttpOnly
        ```
      
- **Error response**
    - Code: 401 UNAUTHORIZED
    - Content:
        Array of errors in the form: ```{type: [error type], msg: [error message]}```
        Example:
        ```json
        [
          {
            "type": "loginPass",
            "msg": "wrong password"
          }
        ]
        ```


## Check user

- **URL**

    ```GET /user/checkToken```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        ```json
        {
          "msg": "You are logged in",
          "user": {
            "id": ["userId"],
            "username": ["username"],
            "email": ["user email"]
          }
        }
        ```
      
- **Error response**
    - Code: 401 UNAUTHORIZED
    
    
## Logout user

- **URL**

    ```PUT /user/logout```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        ```json
        {
          "msg": "Logged out"
        }
        ```
      
- **Error response**
    - Code: 401 UNAUTHORIZED
    
    
## Update user data

- **URL**

    ```PUT /user/update```
    
- **Requires token authorization**
    
- **Body**
    ```
    oldPassword=[current user password]
    newUser=[optional new username]
    newEmail=[optional new email address]
    newPassword=[optional new password]
    newRepeatPassword=[repeat new password]
    ```

- **Success response**
    - Code: 200 OK
    - Content: 
        ```json
        [
          {
            "type": "updateSuc",
            "msg": "updated successfully"
          }
        ]
        ```
      
- **Error response**
    - Code:  409 CONFLICT
    - Content:
        Array of errors in the form: ```{type: [error type], msg: [error message]}```
        Example:
        ```json
        [
          {
            "type": "userEx",
            "msg": "this username is already taken"
          },
          {
            "type": "emailEx",
            "msg": "this email is already registered"
          }
        ]
        ```
    OR
    - Code:  400 BAD REQUEST
    - Content:
        Array of errors in the form: ```{type: [error type], msg: [error message]}```
        Example:
        ```json
        [
          {
            "type": "userVal",
            "msg": "username can contain only alphanumeric characters"
          }
        ]
        ```


## Delete user

- **URL**

    ```DELETE /user/delete```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        ```json
        [
          {
            "type": "deleteSuc",
            "msg": "user deleted"
          }
        ]
        ```


## Get settings

- **URL**

    ```GET /user/settings```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        Object with settings values  
        Example
        ```json
        {
          "darkTheme": true,
          "largeFont": false,
          "autoCompleted": false,
          "autoCalendar": false,
          "allOptions": false,
          "taskLink": false
        }
        ```
    
    
## Change settings

- **URL**

    ```PUT /user/settings```
    
- **Requires token authorization**

- **Body**
    ```
    [setting]:[new value]
    ```

- **Success response**
    - Code: 200 OK
    - Content: 
        Object with new settings values  
        Example
        ```json
        {
          "darkTheme": true,
          "largeFont": false,
          "autoCompleted": false,
          "autoCalendar": false,
          "allOptions": false,
          "taskLink": false
        }
        ```
    
    
## Get emails

- **URL**

    ```GET /user/email```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        List of user's generated email addresses  
        Example
        ```json
        [
          "[userId]-[some string]@[domain]",
          "[userId]-[some string]@[domain]",
          "[userId]-[some string]@[domain]"
        ]
        ```
    
    
## Generate email

- **URL**

    ```PUT /user/email```
    
- **Requires token authorization**

- **Success response**
    - Code: 200 OK
    - Content: 
        New generated email address  
        ```json
        "[userId]-[some string]@[domain]"
        ```
    
    
## Delete email

- **URL**

    ```DELETE /user/email```
    
- **Requires token authorization**

- **Body**
    ```
    emailAddress: [email to delete]
    ```

- **Success response**
    - Code: 200 OK
    - Content: 
        New list of email addresses  
        ```json
        [
          "[userId]-[some string]@[domain]",
          "[userId]-[some string]@[domain]"
        ]
        ```
      
- **Error response**
    - Code: 400 BAD REQUEST
