const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.send('Working!');
})

require('./routes/couchDB.routes')(app);

app.listen(3000, () => {
    console.log("Server is running")
});
