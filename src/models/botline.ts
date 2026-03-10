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
                bearer: '', //token
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

        mophNotify(message: any, message_text: string, client: string, secret: string) {
        console.log(message);
        console.log(message_text);

        let json_message: any = {
            messages: [
                {
                    type: "flex",
                    altText: message_text,
                    contents: {
                        type: "bubble",
                        size: "mega",

                        body: {
                            type: "box",
                            layout: "vertical",
                            spacing: "md",
                            paddingAll: "lg",
                            contents: [

                                {
                                    type: "box",
                                    layout: "vertical",
                                    backgroundColor: "#E7F0FF",
                                    cornerRadius: "12px",
                                    paddingAll: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            text: message_text,
                                            size: "lg",
                                            weight: "bold",
                                            color: "#1A237E",
                                            align: "center",
                                            wrap: true
                                        }
                                    ]
                                },

                                {
                                    type: "text",
                                    text: message,
                                    size: "sm",
                                    color: "#444444",
                                    wrap: true,
                                    lineSpacing: "6px"
                                },

                            ]
                        },

                        footer: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "separator"
                                },
                                {
                                    type: "text",
                                    text: "Risk Management System",
                                    size: "xs",
                                    color: "#999999",
                                    align: "center",
                                    margin: "sm"
                                }
                            ]
                        }

                    }
                }
            ]
        };


        return new Promise((resolve, reject) => {
            request(
                {
                    method: 'POST',
                    uri: 'https://morpromt2f.moph.go.th/api/notify/send',
                    headers: {
                        'Content-Type': 'application/json',
                        'client-key': client,
                        'secret-key': secret,
                    },
                    body: json_message, // ต้องเป็น { messages: [...] }
                    json: true,
                },
                (err: any, httpResponse: any, body: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            statusCode: httpResponse.statusCode,
                            body: body
                        });
                    }
                }
            );
        });
    }

}