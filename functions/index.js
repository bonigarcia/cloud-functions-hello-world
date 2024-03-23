const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const logger = functions.logger;
const app = express();
const db = admin.firestore();

// Hello world endpoint (GET)
app.get("/hello-world", (req, res) => {
    logger.log("Hello world received");
    return res.status(200).send("Hello world!");
});

// Create message on Firestore (GET)
app.get("/add-message", async (req, res) => {
    try {
        let message = req.query.message;
        logger.log("message " + message);
        if (message === undefined) {
            return res.status(400).send("Missing query parameter. Use ?message=something");
        }
        const result = await db
            .collection("messages")
            .add({
                message: message
            });
        return res.status(200).json({
            result: `Added message with id ${result.id}`
        });
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);