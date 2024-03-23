const functions = require("firebase-functions");
const express = require("express");

admin.initializeApp();

const logger = functions.logger;
const app = express();

app.get("/hello-world", (req, res) => {
    logger.log("Hello world received");
    return res.status(200).send("Hello world!");
});

exports.app = functions.https.onRequest(app);