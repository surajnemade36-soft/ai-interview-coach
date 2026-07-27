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


// Test server
app.get("/", (req, res) => {
  res.send("Server is running");
});


// Telegram webhook
app.post("/telegram", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message) {
      return res.sendStatus(200);
    }


    const chatId = message.chat.id;
    const text = message.text || "";


    console.log("🔥 Telegram request received");
    console.log("Message:", text);


    // ================= START =================

    if (text === "/start") {

      await sendTelegram(
        chatId,
        "👋 Welcome to AI Interview Coach Bot!\n\nType /help to see commands."
      );

      console.log("Start reply sent");

    }


    // ================= HELP =================

    else if (text === "/help") {


      await sendTelegram(
        chatId,
`🤖 AI Interview Coach Bot

/start - Start bot
/help - Show commands
/addquestion Your Question
/notice Your Website Notice`
      );


      console.log("Help reply sent");

    }



    // ================= NOTICE =================

    else if (text.startsWith("/notice")) {


      console.log("NOTICE COMMAND");


      const notice = text
        .replace("/notice", "")
        .trim();



      if (!notice) {

        await sendTelegram(
          chatId,
          "❌ Please enter notice.\n\nExample:\n/notice Interview tomorrow at 10 AM"
        );

        return res.sendStatus(200);
      }



      console.log("Saving notice:", notice);



      await db
        .collection("settings")
        .doc("website")
        .set(
          {
            notice: notice,
            interviewEnabled: true
          },
          {
            merge:true
          }
        );



      console.log("Firestore Updated");



      await sendTelegram(
        chatId,
        "✅ Website notice updated successfully!"
      );


      console.log("Notice completed");

    }



    // ================= ADD QUESTION =================


    else if (text.startsWith("/addquestion")) {


      const question = text
        .replace("/addquestion","")
        .trim();



      if(!question){

        await sendTelegram(
          chatId,
          "❌ Please enter question.\nExample:\n/addquestion Explain Java OOP"
        );

        return res.sendStatus(200);
      }



      await db
      .collection("questions")
      .add({

        question: question,

        createdAt:
        admin.firestore.FieldValue.serverTimestamp()

      });



      await sendTelegram(
        chatId,
        "✅ Question added successfully!"
      );


      console.log("Question saved");

    }



    // ================= UNKNOWN =================


    else {


      await sendTelegram(
        chatId,
        "❌ Unknown command.\nType /help"
      );

    }



    res.sendStatus(200);



  } catch(error){


    console.error("ERROR:");
    console.error(
      error.response?.data || error.message
    );


    res.sendStatus(500);

  }

});




// Telegram send function

async function sendTelegram(chatId,text){

  const response = await axios.post(

    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,

    {
      chat_id: chatId,
      text:text
    }

  );


  console.log(
    "Telegram API:",
    response.data.ok
  );


}




// Start server

const PORT = process.env.PORT || 5001;


app.listen(PORT,()=>{

  console.log(
    `✅ Server running on port ${PORT}`
  );

});