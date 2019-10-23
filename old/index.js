const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('./paprika-viewer-firebase-adminsdk-287te-c64d2d20d0.json');

const collection = 'tickers';
const doc = 'current';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://paprika-viewer.firebaseio.com'
});

const db = admin.firestore();

const getTickers = async () => {
    const coinPaprikaResponse = await fetch('https://api.coinpaprika.com/v1/tickers');
    const coinPaprikaJson = await coinPaprikaResponse.json();
    return coinPaprikaJson;
};

if (1 === 2) {
    let tickers = db.collection(collection).doc(doc);
    let getDoc = tickers
        .get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}

if (1 === 1) {
    getTickers().then(tickers => {
        let batch = db.batch();

        tickers.forEach(ticker => {
            let doc = db.collection(collection).doc(ticker.id);

            batch.set(doc, ticker).catch(err => {
                console.log(err.details);
            });
        });

        return batch.commit().then(() => {
            console.log('Done');
        });
    });
}
