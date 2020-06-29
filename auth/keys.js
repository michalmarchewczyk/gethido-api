const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'gethido_rsa.key'));
const publicKey = fs.readFileSync(path.join(__dirname, 'gethido_rsa.pub.key'));

module.exports = {
    privateKey: privateKey,
    publicKey: publicKey
};
