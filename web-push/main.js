var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/cp9fuILId_s:APA91bEx3km5OD73P7KUtPp0fK1LFDoy4ES7jhwoqiAslpxlhg3LsToaYvoF7oSR2zf-7IATr2sxaMWZVhwo5iavIhArm_cLOztPEiRIuoTMP94VzZtQCvkEkZ51j4t-p7VCFAtGXQ7K",
    "keys": {
        "p256dh": "BPtQNkcU4nSegJX3iF/f28Ut0TnHhnHyvFwbjZUhOc9khJ3fjLDRlcIHjKLvSQfnz1FphGcVaIXXH6kOcshu5yo=", 
        "auth": "fjufrWNGQiVAGICmptzlCw=="
    }
};
var payload = 'Here is a payload!';
var options = {
    gcmAPIKey: 'AIzaSyBETnKM0mLZBVvnRQwjA1nClfAVrxHM9bs',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);