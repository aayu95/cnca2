# Team 15
# City: Melbourne

# Aayush Mehta (1105081)
# Abhijeet Singh (1094984)
# Anoushka Doctor (1012827)
# Muhammad Atif (924009)
# Siddharth Agarwal (1077275)


import couchdb
import couchdb.design
import datetime
from common import *

class StreamDatabase(object):

    def __init__(self, databaseName, databaseURL = "http://localhost:5984/"):

        try:
            with open("../../Common/current.txt", 'r') as current:
                ipaddress = current.readline().strip()
            self.databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress)))
            if databaseName in self.databaseServer:
                self.database = self.databaseServer[databaseName]
            else:
                self.database = self.databaseServer.create(databaseName)
        
        except Exception as e:
            with open('streamdabatase_log','a') as f:
                f.write("["+datetime.datetime.now().__str__()+"]"+'\n')
                f.write(str(e)+'\n')
            
    def createViews(self):

        count_map = 'function(doc) { emit(doc.id, 1); }'
        count_reduce = 'function(keys, values) { return sum(values); }'
        view = couchdb.design.ViewDefinition('twitter', 
                                            'countTweets', 
                                            count_map, 
                                            reduce_fun=count_reduce)
        view.sync(self.database)

        getTweets = 'function(doc) { emit(("0000000000000000000"+doc.id).slice(-19), doc); }'
        view = couchdb.design.ViewDefinition('twitter', 'getTweets', getTweets)

        view.sync(self.database)

        lateTweets = 'function(doc) { if (doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") { emit((doc.id), doc);};}'
        view = couchdb.design.ViewDefinition('twitter', 'lateTweets', lateTweets)

        view.sync(self.database)

        countLateTweets = 'function(doc) { if (doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") { emit((doc.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countLateTweets', 
                                                countLateTweets, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsWithCoordinates = 'function(doc) { if (doc.coordinates != null) { emit((doc.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithCoordinates', 
                                                countTweetsWithCoordinates, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsWithSuburb = 'function(doc) { if (doc.suburb_name != null) { emit((doc.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithSuburb', 
                                                countTweetsWithSuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsBySuburb = 'function(doc) { if (doc.suburb_name != null) { emit((doc.suburb_name), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsBySuburb', 
                                                countTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countLateTweetsBySuburb = 'function(doc) { if ((doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") && doc.suburb_name != null) { emit((doc.suburb_name), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countLateTweetsBySuburb', 
                                                countLateTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        sentimentBySuburb = 'function(doc) { if ((doc.suburb_name != null) && (doc.sentiment != null)) { emit((doc.suburb_name.concat(", ").concat(doc.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'sentimentBySuburb', 
                                                sentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        lateSentimentBySuburb = 'function(doc) { if ((doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") && (doc.suburb_name != null) && (doc.sentiment != null)) { emit((doc.suburb_name.concat(", ").concat(doc.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'lateSentimentBySuburb', 
                                                lateSentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        latestTweets = 'function(doc) { { emit(("0000000000000000000"+doc.id).slice(-19), (doc.user.screen_name + " - " + doc.text + " (Suburb - " + doc.suburb_name + ", " + doc.created_at + ")"));};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'latestTweets', 
                                                latestTweets)

        view.sync(self.database)

        sentiment_map = "function(doc) { if (doc.suburb_name != null) {emit(doc.suburb_name, {'polarity_avg':doc.sentiment_polarity, 'positive_count':doc.sentiment_positive, 'negative_count':doc.sentiment_negative, 'neutral_count':doc.sentiment_neutral, 'total_tweet_count':1});};}"
        sentiment_reduce = "function(keys, vals) {\
        var result = {'overall_sentiment':'Undefined', 'polarity_avg':0, 'positive_count':0, 'negative_count':0, 'neutral_count':0, 'total_tweet_count':0};\
            for(var i = 0; i < vals.length; i++) {\
            result.polarity_avg      += vals[i].polarity_avg;\
            result.positive_count    += vals[i].positive_count;\
            result.negative_count    += vals[i].negative_count;\
            result.neutral_count     += vals[i].neutral_count;\
            result.total_tweet_count += vals[i].total_tweet_count;\
            };\
            result.polarity_avg = result.polarity_avg / vals.length;\
            if (result.polarity_avg>=0.2) {result.overall_sentiment='Positive';}\
            else if (result.polarity_avg<=-0.2) {result.overall_sentiment='Negative';}\
            else {result.overall_sentiment='Neutral'};\
        return result;}"      
        view = couchdb.design.ViewDefinition('twitter', 'getTweetSentimentAll', sentiment_map, sentiment_reduce)
        
        view.sync(self.database)

        lateSentiment_map = 'function(doc) { if ((doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") && doc.suburb_name != null) {emit(doc.suburb_name, {"polarity_avg":doc.sentiment_polarity, "positive_count":doc.sentiment_positive, "negative_count":doc.sentiment_negative, "neutral_count":doc.sentiment_neutral, "total_tweet_count":1});};}'
        view = couchdb.design.ViewDefinition('twitter', 'getLateTweetSentimentAll', lateSentiment_map, sentiment_reduce)

        view.sync(self.database)

        tweetsTimeTrend = 'function(doc) { {emit (doc.created_at.substring(11,13), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'tweetsTimeTrend', 
                                                tweetsTimeTrend, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        topSuburbs = 'function(doc) { \
            var suburbs = ["Melbourne","North Melbourne","Southbank","East Melbourne","Richmond (Vic.)","St Kilda","Docklands","Carlton","Melbourne Airport","South Yarra - East","Fitzroy","Prahran - Windsor","South Melbourne","Brunswick","Albert Park","Hawthorn","Kensington (Vic.)","Parkville","Mooroolbark","Skye - Sandhurst","Footscray","Clayton","Yarra Valley","Laverton","Dandenong","Brighton (Vic.)","Collingwood","Burwood","Caulfield - North","Malvern East"];\
            if (doc.suburb_name != null && suburbs.includes(doc.suburb_name)) { emit (doc.suburb_name, 1)};\
            }'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'topSuburbs', 
                                                topSuburbs, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

    def saveTweet(self, tweet):
        tweet['_id'] = tweet['id_str']
        try:
            documentID, documentRev = self.database.save(tweet)
        
        except Exception as e:
            with open('streamdabatase_log','a') as f:
                f.write("["+datetime.datetime.now().__str__()+"]"+'\n')
                f.write(str(e)+'\n')
                f.write((tweet['_id']+'\n'))

    def countTweets(self):
        for doc in self.database.view('twitter/countTweets'):
            return doc.value

    def getTweets(self):
        return self.database.view('twitter/getTweets')

    def lateTweets(self):
        return self.database.view('twitter/lateTweets')