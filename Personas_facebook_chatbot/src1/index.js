require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => console.log('Express server is listening on port 5000'));

const verifyWebhook = require('./verify-webhook');
const messageWebhook = require('./message-webhook');

app.post('/', messageWebhook);
app.get('/', verifyWebhook);

//EAAEzo1h2fxIBAIIPaY2CydCAUPpPuJJRUFVG4ZAQIZCU2YuHD4fxOZBV8EewO0aZCULM3gZBA2L3IxTgDMkn8c0U0oU7H7DwLRWJ2iDpZArFTUZCgVAC4LM435neaXBjVxlt1EYu68o6mvgdkzrZCVqKKPX0TMZBjHSvkoA3Xlcg65AZDZD