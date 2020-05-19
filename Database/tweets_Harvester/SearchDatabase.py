import couchdb
import couchdb.design
from common import *

class SearchDatabase(object):

    def __init__(self, databaseName, databaseURL = "http://localhost:5984/"):
        try:

            self.databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress)))
            if databaseName in self.databaseServer:
                self.database = self.databaseServer[databaseName]
            else:
                self.database = self.databaseServer.create(databaseName)

            self.createViews()
        
        except Exception as e:
            print("Database Exception")
            print (e)
            print (Exception)

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

        countTweetsWithSuburb = 'function(tweet) { if (tweet.suburb != null) { emit((tweet.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithSuburb', 
                                                countTweetsWithSuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsBySuburb = 'function(tweet) { if (tweet.suburb != null) { emit((tweet.suburb), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsBySuburb', 
                                                countTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countLateTweetsBySuburb = 'function(tweet) { if ((tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") && tweet.suburb != null) { emit((tweet.suburb), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countLateTweetsBySuburb', 
                                                countLateTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        sentimentBySuburb = 'function(tweet) { if ((tweet.suburb != null) && (tweet.sentiment != null)) { emit((tweet.suburb.concat(", ").concat(tweet.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'sentimentBySuburb', 
                                                sentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        lateSentimentBySuburb = 'function(tweet) { if ((tweet.created_at.substring(11,13) == "00" || tweet.created_at.substring(11,13) == "01" || tweet.created_at.substring(11,13) == "02" || tweet.created_at.substring(11,13) == "03") && (tweet.suburb != null) && (tweet.sentiment != null)) { emit((tweet.suburb.concat(", ").concat(tweet.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'lateSentimentBySuburb', 
                                                lateSentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)