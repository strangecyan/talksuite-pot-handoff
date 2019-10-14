const request = require('request');
const aws = require('aws4');

module.exports = async function (context, req) {
    context.log('LOG: Bridge has recieved a drift message');

    if(req.body.data.author.bot) {
        return;
    }

    let conversationId = req.body.data.conversationId;
    let message = req.body.data.body;

    let dialogue = 'newDriftMessage';
    if (message.startsWith('/')) {
        dialogue = 'newDriftCommand';
    }

    let payload = {name: dialogue, address: conversationId, value: { message: message }};
    let host = process.env['TS_HOST'];
    let path = `/api/organisations/${process.env['ORG_ID']}/bots/${process.env['BOT_ID']}/dialogue`;

    let options = { host: host, path: path, service: 'execute-api', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } };
    let credentials = { accessKeyId: '', secretAccessKey: 'talksuite<3drift' };
    let res = aws.sign(options, credentials);
    res.uri = 'https://' + res.host + res.path;

    request(res, (err, ress) => {
        console.log(err, ress.statusCode);
    })
};