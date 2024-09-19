var FCM = require('fcm-node');
var dotenv = require('dotenv');
dotenv.config();
var serverKey = process.env.FCM_SERVER_KEY;
var fcm = new FCM(serverKey);

export class FcmHelper {

    static async sendSingleMessageNotification ({ deviceToken, notification, title, body }) {
        var message = {
            to: deviceToken,
            notification: { title, body },
            priority: 'high',
            data: notification,
        };
        await this.fcmSender(message);
    }

    static async SendNotificationWithTitleBody ({ deviceToken, notification, body, notificationTitle }) {
        var message = {
            to: deviceToken,
            notification: { title: notificationTitle, body: body },
            priority: 'high',
            data: notification,
        };
        await this.fcmSender(message);
    }

    static async SendMultipleNotificationWithTitleBody ({ deviceTokens, notification, body, notificationTitle }) {

        console.log(deviceTokens, 'deviceTokens')
        var message = {
            registration_ids: deviceTokens,
            notification: { title: notificationTitle, body: body },
            priority: 'high',
            data: notification,
        };
        await this.fcmSender(message);
    }

    static async fcmSender (message) {
        fcm.send(message, function (err, response) {
            try {
                if (response) {
                    console.log(response, 'ho gaya');
                    return true;
                }
                if (err) {
                    console.log(err, 'err');
                    return true;
                }
            } catch (err) {
                console.log(err, 'err');
                return true;
            }
        });
    }
}
