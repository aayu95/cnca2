import couchdb
import couchdb.design
import datetime
from common import *

class StreamDatabase(object):

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

        countTweetsWithSuburb = 'function(doc) { if (doc.suburb != null) { emit((doc.id), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsWithSuburb', 
                                                countTweetsWithSuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countTweetsBySuburb = 'function(doc) { if (doc.suburb != null) { emit((doc.suburb), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countTweetsBySuburb', 
                                                countTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        countLateTweetsBySuburb = 'function(doc) { if ((doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") && doc.suburb != null) { emit((doc.suburb), 1);};}'
        view = couchdb.design.ViewDefinition('twitter', 
                                                'countLateTweetsBySuburb', 
                                                countLateTweetsBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        sentimentBySuburb = 'function(doc) { if ((doc.suburb != null) && (doc.sentiment != null)) { emit((doc.suburb.concat(", ").concat(doc.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'sentimentBySuburb', 
                                                sentimentBySuburb, 
                                                reduce_fun=count_reduce)

        view.sync(self.database)

        lateSentimentBySuburb = 'function(doc) { if ((doc.created_at.substring(11,13) == "00" || doc.created_at.substring(11,13) == "01" || doc.created_at.substring(11,13) == "02" || doc.created_at.substring(11,13) == "03") && (doc.suburb != null) && (doc.sentiment != null)) { emit((doc.suburb.concat(", ").concat(doc.sentiment)), 1);};} '
        view = couchdb.design.ViewDefinition('twitter', 
                                                'lateSentimentBySuburb', 
                                                lateSentimentBySuburb, 
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