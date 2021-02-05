const request = require("request");
export class BotlineModel {
    botLine(message) {
        request({
            method: 'POST',
            uri: 'https://notify-api.line.me/api/notify',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                // bearer: 'n9XdwQop63zVEdTvOkz4tGUz90LbIosbjmQYXVSM6EN', //token
                bearer: '', //token test code
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
    
    botLabresultLine(message) {
        request({
            method: 'POST',
            uri: 'https://notify-api.line.me/api/notify',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                bearer: 'i4chgMiyX2EOHdoTPMGgxxPNGqknfFxOn8aWFqFD6Gl', //token
                // bearer: '', //token test code
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
}