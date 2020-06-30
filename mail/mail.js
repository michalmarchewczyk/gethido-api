const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;

const {HOST, PORT} = require('./mailConfig');

const getEmailList = ({username, password, lastEmail}) => new Promise ((resolve, reject) => {
    if (!lastEmail) lastEmail = 1;
    let messages = [];
    const imap = new Imap({
        user: `${username}@${HOST}`,
        password: password,
        host: HOST,
        port: PORT,
        // tls: true
    });
    imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) {
                reject(err);
                throw err;
            }
            let fetchEmails = imap.seq.fetch(`${lastEmail}:*`, {bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',});
            let lastNo = 0;
            let endNo;
            fetchEmails.on('message', async (msg, seqno) => {
                lastNo = seqno;
                let message = {};
                msg.once('body', async (stream, info) => {
                    const parsed = await simpleParser(stream);
                    message.from = parsed.from.text;
                    message.to = parsed.to.text;
                    message.title = parsed.subject;
                    message.date = parsed.date;
                    message.email = `${username}@${HOST}`;
                    if(endNo && seqno === endNo){
                        resolve(messages);
                    }
                });
                msg.once('attributes', (attrs) => {
                    message.uid = attrs.uid;
                });
                msg.once('end', () => {
                    messages.push(message);
                });
            });
            fetchEmails.once('error', (err) => {
                console.log(err);
            });
            fetchEmails.once('end', () => {
                imap.end();
                endNo = lastNo;
                if(endNo === 0){
                    resolve([]);
                }
            })
        });
    });

    imap.once('error', (err) => {
        reject(err);
    });
    // imap.once('end', () => {
    //     console.log('end');
    // });
    imap.connect();
});



const getEmail = ({username, password, emailUID}) => new Promise ((resolve, reject) => {
    if (!emailUID) reject();
    let messages = [];
    const imap = new Imap({
        user: `${username}@${HOST}`,
        password: password,
        host: HOST,
        port: PORT,
        // tls: true
    });
    imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) {
                reject(err);
                throw err;
            }
            let fetchEmails = imap.seq.fetch(`${emailUID}`, {bodies: '',});
            fetchEmails.on('message', async (msg, seqno) => {
                let message = {};
                msg.once('body', async (stream, info) => {
                    const parsed = await simpleParser(stream);
                    message.from = parsed.from.text;
                    message.to = parsed.to.text;
                    message.title = parsed.subject;
                    message.date = parsed.date;
                    if(parsed.html){
                        message.html = parsed.html;
                    }else{
                        message.html = parsed.textAsHtml;
                    }
                    message.email = `${username}@${HOST}`;
                    resolve(messages);
                });
                msg.once('attributes', (attrs) => {
                    message.uid = attrs.uid;
                });
                msg.once('end', () => {
                    messages.push(message);
                });
            });
            fetchEmails.once('error', (err) => {
                throw err;
            });
            fetchEmails.once('end', () => {
                imap.end();
            })
        });
    });

    imap.once('error', (err) => {
        reject(err);
    });
    // imap.once('end', () => {
    //     console.log('end');
    // });
    imap.connect();
});


module.exports = {
    getEmailList,
    getEmail,
};

