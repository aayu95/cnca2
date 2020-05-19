import tweepy
import json
from SearchDatabase import SearchDatabase
from StreamDatabase import StreamDatabase
import couchdb
import time
from textblob import TextBlob
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from common import *


# databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress)))
# streamingDatabase = databaseServer['newtestsearchstream']

searchDatabase = SearchDatabase('latestviewsearchtest')

auth = tweepy.OAuthHandler(APIKey, APISecretKey)
auth.set_access_token(AccessToken, AccessTokenSecret)
api = tweepy.API(auth)

contents = tweepy.Cursor(api.search, q="*",
                         geocode="-37.9726,145.0531,60km", lang="en").items()

while True:
    try:
        content = next(contents)

    except tweepy.TweepError:

        time.sleep(950)
        content = next(contents)

    except StopIteration:

        break

    try:

        tweetsJson = json.dumps(content._json, ensure_ascii=False)
        doc = json.loads(tweetsJson)
        docid = doc['id_str']

        # if docid in searchDatabase.database or docid in streamingDatabase:
        #     print('The tweet is already present')

        if docid in searchDatabase.database:
            print('The tweet is already present')

        else:
            print('%s -- %s' % (doc['user']['screen_name'], doc['text']))
            print('%s\n' % (doc['created_at']))
            docId = doc['id']
            doctext = doc['text']
            docCoordinates = doc['coordinates']
            docUser = doc['user']
            docTime = doc['created_at']
            docPlace = doc['place']
            docentities = doc['entities']
            sentimentPolarity = TextBlob(doctext).polarity

            if (sentimentPolarity > 0):
                sentiment = "positive"
            
            elif (sentimentPolarity < 0):
                sentiment = "negative"
            
            else:
                sentiment = "neutral"

            try:

                if (docCoordinates is not None):
                    longitude = docCoordinates['coordinates'][0]
                    latitude = docCoordinates['coordinates'][1]
                    point = Point(longitude, latitude)
                    for i in geoLocations.keys():
                        if geoLocations[i]['type'] == 'polygon':
                            if geoLocations[i]['polygon'].contains(point):
                                suburbId = i
                                suburb = geoLocations[suburbId]['name']
                        else:
                            for polygon in geoLocations[i]['polygons']:
                                if polygon.contains(point):
                                    suburbId = i
                                    suburb = geoLocations[suburbId]['name']
                
                else:
                    suburbId = None
                    suburb = None

            except Exception:
                suburb = None

            tweet = {'_id': docid, 'id': docId, 'text': doctext, 'user': docUser,
                    'coordinates': docCoordinates, 'created_at': docTime,
                    'place': docPlace, 'entities': docentities,
                    'addressed': False, 'sentiment': sentiment, 'suburb': suburb}
            searchDatabase.database.save(tweet)


    except Exception as e:
        print(e)
        print(Exception)



