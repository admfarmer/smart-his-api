const request = require("request");
export class SmartcardModel {

    getSmartcard() {
        console.log('------test--------');

        request({
            method: 'GET',
            uri: 'https://localhost:8443/smartcard/data/',
            json: true
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err)
            } else {
                console.log(body)
            }
        })
    }
}