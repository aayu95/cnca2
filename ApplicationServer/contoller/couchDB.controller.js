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