const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const logger = functions.logger;
const app = express();

app.get("/hello-world", (req, res) => {
    logger.log("Hello world received");
    return res.status(200).send("Hello world!");
});

exports.app = functions.https.onRequest(app);