module.exports = (app) =>{
    const couchDB = require('../contoller/couchDB.controller.axios')

    app.get('/allTweets', couchDB.fetchAll);

    app.get('/getSentimentBySuburb',couchDB.getSentimentBySuburb);

    app.get('/getLateSentimentBySuburb',couchDB.getLateSentimentBySuburb);

    app.get('/getTweetCountBySuburb', couchDB.getTweetCountBySuburb)

    app.get('/getLateTweetCountBySuburb',couchDB.getLateTweetCountBySuburb)

    app.get('/getLatestTweets',couchDB.getLatestTweets)

    app.get('/getTweetCount',couchDB.getTweetCount)
}