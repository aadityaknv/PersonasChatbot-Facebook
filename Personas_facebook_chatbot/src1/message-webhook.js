const processMessage = require('./process-message');

module.exports = (req, res) => {
    console.log(req);
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    processMessage(event);
                 }
             });
        });

    res.status(200).end();
    }
};