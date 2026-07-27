import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import db from "./firebaseAdmin.js";
import admin from "firebase-admin";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server is running");
});


app.post("/telegram", async (req, res) => {
  try {
    console.log("🔥 Telegram request received");

    const message = req.body.message;

    if (!message) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const text = message.text;

    console.log("Message:", text);
    console.log("Token:", process.env.TELEGRAM_TOKEN);

    if (text === "/start") {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: "👋 Welcome to AI Interview Coach Bot!\n\nType /help to see all commands."
        }
      );

      console.log("/start reply sent");
    }

    else if (text === "/help") {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text:
`🤖 AI Interview Coach Bot

Available Commands

/start - Start Bot
/help - Show Commands
/addquestion Your Question
/listquestions
/deletequestion ID
/notice Your Message`
        }
      );

      console.log("/help reply sent");
    }
// ---------- /addquestion ----------
else if (text.startsWith("/addquestion")) {
  try {
    const question = text.replace("/addquestion", "").trim();
    console.log("Inside /addquestion");

    console.log("Question:", question);
    console.log("Saving to Firestore...");

   await db.collection("questions").doc().set({
  question: question,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
});

    console.log("Question saved successfully");

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: "✅ Question added successfully!"
      }
    );

  } catch (error) {
    console.error("ADD QUESTION ERROR:");
    console.error("ADD QUESTION ERROR:", error.stack);
  }
}
    res.sendStatus(200);

  } catch (err) {
    console.error("Telegram Error:");
    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
});


const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});