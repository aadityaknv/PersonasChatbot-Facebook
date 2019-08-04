# Personas Facebook Chatbot

## 1. Install Node.js

### Windows
*1. Download Node.js* (https://nodejs.org/en/) *(LTS Version Recommended)  and Git*  (https://git-scm.com/downloads) <br/>

*2. Open Node.js Command Prompt and type to display versions*
 node -v
 npm –v

### Mac
*1. Install Xcode from App Store or update to the latest version if already installed* (https://itunes.apple.com/ae/app/xcode/id497799835?mt=12)

*2. Open Terminal and Install Homebrew (https://brew.sh) using the following command*
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  
*3. Install node*
  brew install git
  brew install node
Check node & npm version
    node -v
    npm -v


## 2. Setting up a Facebook Page

## 3. Creating a Facebook App

## 4. Dialogflow

## 5. Setting up your webhook server

Create a directory with the name of your choice. Inside the directory run the following command. 
```
npm init
```
Fill out the necessary information. This creates a _package.json_ file. 

Create a folder named _src_, this will be the root directory.
```
npm install body-parser express
```
Once the installation is complete, create an _index.js_ file in the _src_ directory. 

````
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => console.log('Express server is listening on port 5000'));
````
Save the file and run **node index.js** from the _src_ in the terminal.

## 6. Set up Facebook verification endpoint

Create a file called _verify-webhook.js_ in the _src_ folder.
```
const verifyWebhook = (req, res) => {
let VERIFY_TOKEN = 'token-name';

let mode = req.query['hub.mode'];
let token = req.query['hub.verify_token'];
let challenge = req.query['hub.challenge'];

if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
} else {
    res.sendStatus(403);
    }
};

module.exports = verifyWebhook;
```

Set up our endpoint by adding the following code to your _index.js_ file.
````
const verifyWebhook = require('./verify-webhook');

    app.get('/', verifyWebhook);
```` 
Stop your server by pressing **ctrl + c** and restart it with **node index.js**

## 7. Expose your server to the web

Go to https://ngrok.com/download and follow the steps to download and install ngrok. Make sure after installation the ngrok file is in your _src_ folder
````
./ngrok http 5000 
````
Facebook App Webhook verification

Dialogflow integration bot

````
npm install --save dotenv
````

Add the following line to the top of your _index.js_ file.
````
require('dotenv').config({ path: 'variables.env' });
````

Installing the Dialogflow API and install **node-fetch** which will be used to send request to facebook.
````
npm install --save dialogflow
npm install --save node-fetch

````
Now create a file called _process-message.js_ in your _src_ directory and add the following code.

````
const fetch = require('node-fetch');

// You can find your project ID in your Dialogflow agent settings
const projectId = ''; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

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

const sendTextMessage = (userId, text) => {
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
    return sendTextMessage(userId, result.fulfillmentText);
    })
    .catch(err => {
    console.error('ERROR:', err);
    });
}
````
Add the following code to _index.js_ in your _src_ directory, in order to recieve message events from facebook

````
const messageWebhook = require('./message-webhook');

app.post('/', messageWebhook);
````
Create a file called _message-webhook.js_ in your _src_ directory and add the following code.
````
const processMessage = require('./process-message');

module.exports = (req, res) => {
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

````
## 8: Creating Personas and implementing Persona to our chatbot

Refer this link : https://developers.facebook.com/docs/messenger-platform/reference/personas-api/

To make Http Requests online : https://reqbin.com/ 

## 9: Implementing WolframAlpha API for intelligent responses

First, install the library into your project by running the following command:
````
npm install https://products.wolframalpha.com/api/libraries/javascript/wolfram-alpha-api-1.0.0-rc.1.tgz
````
Next, import the class, and instantiate it with your 'AppID':

````
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('DEMO-APPID');
````
Refer https://products.wolframalpha.com/api/libraries/javascript/ for more information.

"https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg"



