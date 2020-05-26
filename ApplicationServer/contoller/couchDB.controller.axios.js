const axios = require('axios')
const fs = require('fs');
const readline = require('readline');
const path = require('path');
var ip = '';

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
  ip = line;
  axios.defaults.baseURL = 'http://admin:qweasdzxc@' + line + ':5984/';
  console.log(axios.defaults.baseURL);
  return line;
}

setCouchURL(path.resolve('../Common/current.txt'));


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

exports.getIp = (req, res) => {
  res.send({ 'ip': ip })

};

exports.getTweetCountBySuburb = (req, res) => {
  axios.get('tweets/_design/twitter/_view/countTweetsBySuburb?group_level=1&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getLateTweetCountBySuburb = (req, res) => {
  axios.get('tweets/_design/twitter/_view/countLateTweetsBySuburb?group_level=1&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};


exports.getSentimentBySuburb = (req, res) => {
  streamRes = [];
  searchRes = [];
  axios.get('tweets/_design/twitter/_view/getTweetSentimentAll?group_level=1&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getLateSentimentBySuburb = (req, res) => {
  streamRes = [];
  searchRes = [];
  axios.get('tweets/_design/twitter/_view/getLateTweetSentimentAll?group_level=1&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getLatestTweets = (req, res) => {
  axios.get('tweets/_design/twitter/_view/latestTweets?limit=10&descending=true&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getTweetCount = (req, res) => {
  axios.get('tweets/_design/twitter/_view/countTweets?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getTimeTrend = (req, res) => {
  axios.get('tweets/_design/twitter/_view/tweetsTimeTrend?group_level=1&update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinAgeData = (req, res) => {
  axios.get('aurin_age/_design/aurin/_view/countYoungPeopleInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};


exports.getAurinAlcoholData = (req, res) => {
  axios.get('/aurin_alcohol/_design/aurin/_view/countAlcoholConsumptionInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinDiseaseData = (req, res) => {
  axios.get('aurin_chronic_disease/_design/aurin/_view/countChronicDiseaseInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinNationalityData = (req, res) => {
  axios.get('aurin_country_of_birth/_design/aurin/_view/countNationalityInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinEducationData = (req, res) => {
  axios.get('aurin_education/_design/aurin/_view/countNonSchoolQualificationInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinHealthData = (req, res) => {
  axios.get('aurin_health/_design/aurin/_view/countPoorHealthInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinIncomeData = (req, res) => {
  axios.get('aurin_income/_design/aurin/_view/meanIncomeInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinLifeSatisfactionData = (req, res) => {
  axios.get('aurin_life_sat/_design/aurin/_view/countHighLifeSatisfactionInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};

exports.getAurinCreativityData = (req, res) => {
  axios.get('aurin_pos/_design/aurin/_view/countCreativeArtsInSuburbTop30?update=lazy')
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.send(error.response.data);
    });
};







