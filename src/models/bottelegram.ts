const request = require("request");

export class BotTelegramModel {
    // constructor() {
    //     this.telegramToken = ''; // ใส่ Telegram Bot Token ของคุณ
    //     this.chatId = ''; // ใส่ Chat ID ที่ต้องการส่งข้อความไป
    // }

    sendTelegramMessage(telegramToken:any,chatId:any,message:any) {
        const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

        request({
            method: 'POST',
            uri: url,
            json: true,
            body: {
                chat_id: chatId,
                text: message,
            },
        }, (err, httpResponse, body) => {
            if (err) {
                console.error("Error sending to Telegram:", err);
            } else {
                console.log("Telegram response:", body);
            }
        });
    }

}