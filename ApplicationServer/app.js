/*
Team number: 15
City: Melbourne 
Team Members: Aayush Mehta (1105081); Abhijeet Singh (1094984); Anoushka Doctor (1012827); Muhammad Atif (924009); Siddharth Agarwal (1077275)
*/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('../UI/',{root:'../'}));

// app.get('/ip', function(req, res){
//     res.send(req.ip)
//   });

app.get('/', function(req, res){
  res.sendFile('/UI/index.html',{root:'../'});
});


require('./routes/couchDB.routes')(app);


app.listen(3000, () => {
    console.log("Server is running")
});
