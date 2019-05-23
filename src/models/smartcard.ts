const request = require("request");
export class SmartcardModel {

    getSmartcard() {
        return new Promise((resolve: any, reject: any) => {
            var options = {
                method: 'GET',
                url: `https://localhost:8443/smartcard/data/`,
                json: true
            };

            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }


}