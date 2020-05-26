/*
Team number: 15
City: Melbourne 
Team Members: Aayush Mehta (1105081); Abhijeet Singh (1094984); Anoushka Doctor (1012827); Muhammad Atif (924009); Siddharth Agarwal (1077275)
*/

const nano = require('nano')('http://admin:qweasdzxc@115.146.94.145:5984');


exports.fetchAll=(req,res)=>{
    nano.db.list().then((body) => {
        // body is an array
        console.log(body);
        body.forEach((db) => {
          console.log(db);
        });
        res.send({"databases":body});
      });
      
};