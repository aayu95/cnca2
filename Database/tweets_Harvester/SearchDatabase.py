import couchdb
import couchdb.design
import datetime
from common import *

class SearchDatabase(object):

    def __init__(self, databaseName, databaseURL = "http://localhost:5984/"):
        try:
            with open("../../Common/current.txt", 'r') as current:
                ipaddress = current.readline().strip()
            self.databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress)))
            if databaseName in self.databaseServer:
                self.database = self.databaseServer[databaseName]
            else:
                self.database = self.databaseServer.create(databaseName)

            self.createViews()
        
        except Exception as e:
            with open('searchdabatase_log','a') as f:
                f.write("["+datetime.datetime.now().__str__()+"]"+'\n')
                f.write(str(e)+'\n')

    def createViews(self):

        count_map = 'function(tweet) { emit(tweet.id, 1); }'
        count_reduce = 'function(keys, values) { return sum(values); }'
        view = couchdb.design.ViewDefinition('twitter', 
                                            'countTweets', 
                                            count_map, 
                                            reduce_fun=count_reduce)
        view.sync(self.database)

        getTweets = 'function(tweet) { emit(("0000000000000000000"+tweet.id).slice(-19), tweet); }'
        view = couchdb.design.ViewDefinition('twitter', 'getTweets', getTweets)

        view.sync(self.database)

        lateTweets = 'function(tweet) { if (tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") { emit((tweet.id), tweet);};}'
        view = couchdb.design.ViewDefinition('twitter', 'lateTweets', lateTweets)

        view.sync(self.database)

        countLateTweets = 'function(tweet) { if (tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") { emit((tweet.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                            'countLateTweets', 
                                            countLateTweets, 
                                            reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsWithCoordinates = 'function(tweet) { if (tweet.coordinates != null) { emit((tweet.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithCoordinates', 
                                                countTweetsWithCoordinates, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsWithSuburb = 'function(tweet) { if (tweet.suburb_name != null) { emit((tweet.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithSuburb', 
                                                countTweetsWithSuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsBySuburb = 'function(tweet) { if (tweet.suburb_name != null) { emit((tweet.suburb_name), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsBySuburb', 
                                                countTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countLateTweetsBySuburb = 'function(tweet) { if ((tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") && tweet.suburb_name != null) { emit((tweet.suburb_name), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countLateTweetsBySuburb', 
                                                countLateTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        sentimentBySuburb = 'function(tweet) { if ((tweet.suburb_name != null) && (tweet.sentiment != null)) { emit((tweet.suburb_name.concat(", ").concat(tweet.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'sentimentBySuburb', 
                                                sentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        lateSentimentBySuburb = 'function(tweet) { if ((tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") && (tweet.suburb_name != null) && (tweet.sentiment != null)) { emit((tweet.suburb_name.concat(", ").concat(tweet.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'lateSentimentBySuburb', 
                                                lateSentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        latestTweets = 'function(tweet) { { emit(("0000000000000000000"+tweet.id).slice(-19), (tweet.user.screen_name + " - " + tweet.text + " (Suburb - " + tweet.suburb_name + ", " + tweet.created_at + ")"));};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'latestTweets', 
                                                latestTweets)

        view.sync(self.database)

        sentiment_map = "function(tweet) { if (tweet.suburb_name != null) {emit(tweet.suburb_name, {'polarity_avg':tweet.sentiment_polarity, 'positive_count':tweet.sentiment_positive, 'negative_count':tweet.sentiment_negative, 'neutral_count':tweet.sentiment_neutral, 'total_tweet_count':1});};}"
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

        lateSentiment_map = 'function(tweet) { if ((tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") && tweet.suburb_name != null) {emit(tweet.suburb_name, {"polarity_avg":tweet.sentiment_polarity, "positive_count":tweet.sentiment_positive, "negative_count":tweet.sentiment_negative, "neutral_count":tweet.sentiment_neutral, "total_tweet_count":1});};}'
        view = couchdb.design.ViewDefinition('twitter', 'getLateTweetSentimentAll', lateSentiment_map, sentiment_reduce)

        view.sync(self.database)

        tweetsTimeTrend = 'function(tweet) { {emit (tweet.created_at.substring(11,13), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'tweetsTimeTrend', 
                                                tweetsTimeTrend, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        topSuburbs = 'function(tweet) { \
            var suburbs = ["Melbourne","North Melbourne","Southbank","East Melbourne","Richmond (Vic.)","St Kilda","Docklands","Carlton","Melbourne Airport","South Yarra - East","Fitzroy","Prahran - Windsor","South Melbourne","Brunswick","Albert Park","Hawthorn","Kensington (Vic.)","Parkville","Mooroolbark","Skye - Sandhurst","Footscray","Clayton","Yarra Valley","Laverton","Dandenong","Brighton (Vic.)","Collingwood","Burwood","Caulfield - North","Malvern East"];\
            if (tweet.suburb_name != null && suburbs.includes(tweet.suburb_name)) { emit (tweet.suburb_name, 1)};\
            }'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'topSuburbs', 
                                                topSuburbs, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)