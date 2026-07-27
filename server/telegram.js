import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;


export const sendMessage = async (chatId, text) => {

    const url =
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
        chat_id: chatId,
        text: text
    });

};