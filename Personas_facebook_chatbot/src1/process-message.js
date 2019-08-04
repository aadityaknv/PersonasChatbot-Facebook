const fetch = require('node-fetch');

// You can find your project ID in your Dialogflow agent settings
const projectId = 'assemblybot-cf916'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

const PERSONA_ID_1 = "1662789763865207";
const PERSONA_ID_2 = "2512565945429935";

const config = {
    credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage = (userId, text, personaId) => {
    return fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
    messaging_type: 'RESPONSE',
    recipient: {
        id: userId,
    },
    message: {
        text,
        },
    persona_id : personaId
    }),
}
);
}

module.exports = (event) => {
    const userId = event.sender.id;
    const message = event.message.text;

    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: message,
        languageCode: languageCode,
        },
    },
};

sessionClient
    .detectIntent(request)
    .then(responses => {
    const result = responses[0].queryResult;
    
    var userText = result.queryText.toString();
    if (userText.includes("who are you"))
    {
        return sendTextMessage(userId, "I am a bot in In5.", PERSONA_ID_2);
    }

    console.log("here");
    return sendTextMessage(userId, result.fulfillmentText, PERSONA_ID_1);
    })
    .catch(err => {
    console.error('ERROR:', err);
    });
}