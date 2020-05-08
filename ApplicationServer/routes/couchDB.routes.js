module.exports = (app) =>{
    const couchDB = require('../contoller/couchDB.controller.axios')

    app.get('/allTweets', couchDB.fetchAll);
}