const fetch = require('node-fetch');
const WolframAlphaAPI = require('wolfram-alpha-api');

//You can find your WolframAlpha API Key by clicking on Edit under your app name.
const waApi = WolframAlphaAPI('ENTER YOUR WOLFRAMALPHA API KEY'); //http://developer.wolframalpha.com/portal/myapps/index.html

const PERSONA_ID_1 = "YOUR FIRST PERSONA ID";
const PERSONA_ID_2 = "YOUR SECOND PERSONA ID";

    // You can find your project ID in your Dialogflow agent settings
    const projectId = 'DIALOGFLOW PROJECT ID'; //https://dialogflow.com/docs/agents#settings
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

    const sendTextMessage = (userId, text, personaID) => {
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
            persona_id : personaID
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
          if (userText.includes("Q:") || userText.includes("q:"))
          {
            userText = userText.toLowerCase();
            userText = userText.toString().replace("q: ", "");
            console.log(userText);
            
              waApi.getShort(userText).then((data) => {
                return sendTextMessage(userId, data, PERSONA_ID_2);
              }).catch((err) => {
                // Handle any error that occurred in any of the previous
                // promises in the chain.
                console.error(err);
                sendTextMessage(userId, "I did not understand your question. Try again.", PERSONA_ID_2);
              });
          }
          else
          { 
            console.log(userText);
            return sendTextMessage(userId, result.fulfillmentText, PERSONA_ID_1);
          }
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }
