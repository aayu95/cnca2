const axios = require('axios')

axios.defaults.baseURL='http://admin:qweasdzxc@115.146.94.145:5984/';
// axios.get('tweets_dataset/_design/twitter/_view/getTweets')
//     .then(function (response) {
//       console.log(response);
//       console.log("Success");
//     })
//     .catch(function (error) {
//       console.log(error.response);
//       console.log("Error")
//     });


exports.fetchAll=(req,res)=>{
    axios.get('tweets_dataset/_design/twitter/_view/getTweets')
    .then(function (response) {
      //console.log(response);
      res.send(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });
    
      
};