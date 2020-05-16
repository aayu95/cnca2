const axios = require('axios')

axios.defaults.baseURL = 'http://admin:qweasdzxc@172.26.131.40:5984/';
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
  axios.get('newtestsearch/_design/twitter/_view/sentimentBySuburb?group_level=1')
    .then(function (response) {
      //console.log(response);
      //res.send(response.data);
      searchRes = response.data.rows;
      axios.get('newteststream/_design/twitter/_view/sentimentBySuburb?group_level=1')
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

exports.getLateSentimentBySuburb = (req, res) => {
  streamRes = [];
  searchRes = [];
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
  streamRes = [];
  searchRes = [];
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
  streamRes = [];
  searchRes = [];
  axios.get('newtestsearch/_design/twitter/_view/countTweetsBySuburb?group_level=1')
    .then(function (response) {
      //console.log(response);
      //res.send(response.data);
      searchRes = response.data.rows;
      axios.get('newteststream/_design/twitter/_view/countTweetsBySuburb?group_level=1')
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

