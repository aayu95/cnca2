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
