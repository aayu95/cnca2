const axios = require('axios')
const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function setCouchURL(pathToFile) {
  const readable = fs.createReadStream(pathToFile);
  const reader = readline.createInterface({ input: readable });
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  axios.defaults.baseURL = 'http://admin:qweasdzxc@'+line+':5984/';
  console.log(axios.defaults.baseURL);
  return line;
}

setCouchURL(path.resolve('../Common/hosts.txt'));


//axios.defaults.baseURL = 'http://admin:qweasdzxc@172.26.131.40:5984/';
// axios.get('tweets_dataset/_design/twitter/_view/getTweets')
//     .then(function (response) {
//       console.log(response);
//       console.log("Success");
//     })
//     .catch(function (error) {
//       console.log(error.response);
//       console.log("Error")
//     });


exports.fetchAll = (req, res) => {
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



exports.getSentimentBySuburb = (req, res) => {
  streamRes = [];
  searchRes = [];
  axios.get('tweets/_design/twitter/_view/getTweetSentimentAll?group_level=1')
    .then(function (response) {
      //console.log(response);
      res.send(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

exports.getLateSentimentBySuburb = (req, res) => {
  axios.get('newtestsearch/_design/twitter/_view/lateSentimentBySuburb?group_level=1')
    .then(function (response) {
      //console.log(response);
      //res.send(response.data);
      searchRes = response.data.rows;
      axios.get('newteststream/_design/twitter/_view/lateSentimentBySuburb?group_level=1')
        .then(function (response) {
          streamRes = response.data.rows;
          res.send({ 'result': streamRes.concat(searchRes) });
        })
        .catch(function (error) {
          //console.log(error);
          res.send(error.response.data);
        });
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

exports.getLateTweetCountBySuburb = (req, res) => {
  axios.get('newtestsearch/_design/twitter/_view/countLateTweetsBySuburb?group_level=1')
    .then(function (response) {
      //console.log(response);
      //res.send(response.data);
      searchRes = response.data.rows;
      axios.get('newteststream/_design/twitter/_view/countLateTweetsBySuburb?group_level=1')
        .then(function (response) {
          streamRes = response.data.rows;
          res.send({ 'result': streamRes.concat(searchRes) });
        })
        .catch(function (error) {
          //console.log(error);
          res.send(error.response.data);
        });
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

exports.getTweetCountBySuburb = (req, res) => {
  axios.get('tweets/_design/twitter/_view/countTweetsBySuburb?group_level=1')
    .then(function (response) {
      //console.log(response);
      res.send(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

exports.getLatestTweets = (req, res) => {
  axios.get('tweets/_design/twitter/_view/latestTweets?limit=10&descending=true&update=lazy')
    .then(function (response) {
      //console.log(response);
      res.send(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

exports.getTweetCount = (req, res) => {
  axios.get('tweets/_design/twitter/_view/countTweets')
    .then(function (response) {
      //console.log(response);
      res.send(response.data);
    })
    .catch(function (error) {
      //console.log(error);
      res.send(error.response.data);
    });

};

