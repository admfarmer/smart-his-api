const request = require("request");
export class BotlineModel {
    botLine(message) {
        console.log(message);

        request({
            method: 'POST',
            uri: 'https://notify-api.line.me/api/notify',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                bearer: 'n9XdwQop63zVEdTvOkz4tGUz90LbIosbjmQYXVSM6EN', //token
            },
            form: {
                message: message, //ข้อความที่จะส่ง
            },
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err)
            } else {
                console.log(body)
            }
        })
    }

    // async compareHash(password, hash) {
    //   if (bcrypt.compareSync(password, hash)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

}