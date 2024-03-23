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

// Read all messages on Firestore (GET)
app.get("/get-messages", async (req, res) => {
    try {
        const result = await db
            .collection("messages")
            .get();
        let messages = [];
        result.docs.map((msg) => {
            let message = msg.data();
            message.id = msg.id;
            messages.push(message);
        });
        return res.status(200).json(messages);
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

// Read single message on Firestore (GET)
app.get("/get-message/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await db
            .collection("messages")
            .doc(id)
            .get();
        return res.status(200).json(result.data());
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

// Create message on Firestore (POST)
app.post("/post-message", async (req, res) => {
    try {
        let id = req.body.id;
        let message = req.body.message;
        const result = await db
            .collection("messages")
            .doc(id)
            .create({
                message: message
            });
        return res.status(200).json({
            result: `Added message with id ${id}`
        });
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

// Update message on Firestore (POST)
app.post("/update-message/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let message = req.body.message;
        const result = await db
            .collection("messages")
            .doc(id)
            .update({
                message: message
            });
        return res.status(200).json({
            result: `Updated message with id ${id}`
        });
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

// Delete message on Firestore (POST)
app.delete("/delete-message/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await db
            .collection("messages")
            .doc(id)
            .delete();
        return res.status(200).json({
            result: `Deleted message with id ${id}`
        });
    } catch (error) {
        logger.error("Error " + error);
        return res.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);