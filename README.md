# GeThiDo-API

![GitHub package.json version](https://img.shields.io/github/package-json/v/michalmarchewczyk/gethido-api)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/michalmarchewczyk/gethido-api)
![GitHub last commit](https://img.shields.io/github/last-commit/michalmarchewczyk/gethido-api)

GeThiDo-API is a RESTful API for creating tools based on "Getting Things Done" time management method. 

## Technologies
Project is created with:
- Node.js
- Express.js
- MongoDB

## Setup

To run this project:

1. Clone this repository
    ```bash
    git clone https://github.com/michalmarchewczyk/gethido-api
    ```

1. Install all dependencies
    ```bash
    npm install
    ```
   
1. Generate public/private RSA key pair in PEM format and change filenames in [auth/keys.js](auth/keys.js)
    ```javascript
    const privateKey = fs.readFileSync(path.join(__dirname, '[file_name].key'));
    const publicKey = fs.readFileSync(path.join(__dirname, '[file_name].pub.key'));
    ```
   
1. Change database config in [db/dbConfig.js](db/dbConfig.js)
   
1. Start the server
    ```bash
   npm start
    ```

## Usage
GeThiDo-API is REST API with two types of endpoints:

#### Users API
For user-related actions endpoints have the form: **https://[URL]/user/[endpoint]**

Docs for user-related actions: [docs/user.md](docs/user.md)

#### Tasks API
For tasks-related actions endpoint have the form: **https://[URL]/tasks/[endpoint]**

Docs for tasks-related actions: [docs/tasks.md](docs/tasks.md)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](LICENSE)
