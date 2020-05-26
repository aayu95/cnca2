/*
Team number: 15
City: Melbourne 
Team Members: Aayush Mehta (1105081); Abhijeet Singh (1094984); Anoushka Doctor (1012827); Muhammad Atif (924009); Siddharth Agarwal (1077275)
*/

module.exports = (app) => {
    const couchDB = require('../contoller/couchDB.controller.axios')

    app.get('/allTweets', couchDB.fetchAll);

    app.get('/getIp', couchDB.getIp);

    app.get('/getTweetCountBySuburb', couchDB.getTweetCountBySuburb)

    app.get('/getLateTweetCountBySuburb', couchDB.getLateTweetCountBySuburb)

    app.get('/getSentimentBySuburb', couchDB.getSentimentBySuburb);

    app.get('/getLateSentimentBySuburb', couchDB.getLateSentimentBySuburb);

    app.get('/getLatestTweets', couchDB.getLatestTweets)

    app.get('/getTweetCount', couchDB.getTweetCount)

    app.get('/getTimeTrend', couchDB.getTimeTrend)

    app.get('/getAurinAgeData', couchDB.getAurinAgeData)

    app.get('/getAurinAlcoholData', couchDB.getAurinAlcoholData)

    app.get('/getAurinDiseaseData', couchDB.getAurinDiseaseData)

    app.get('/getAurinNationalityData', couchDB.getAurinNationalityData)

    app.get('/getAurinHealthData', couchDB.getAurinHealthData)

    app.get('/getAurinIncomeData', couchDB.getAurinIncomeData)
    
    app.get('/getAurinLifeSatisfactionData', couchDB.getAurinLifeSatisfactionData)

    app.get('/getAurinCreativityData', couchDB.getAurinCreativityData)


}