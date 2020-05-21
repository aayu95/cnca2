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


searchDatabase = SearchDatabase('tweets')

Current = []
with open("../../Common/current.txt", 'r') as current:
    Current = current.readlines()

APIKey = Current[1].strip()
APISecretKey = Current[2].strip()
AccessToken = Current[3].strip()
AccessTokenSecret = Current[4].strip()

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
            sentiment_positive = 0
            sentiment_negative = 0
            sentiment_neutral  = 0
            sentimentPolarity = TextBlob(doctext).polarity

            if (sentimentPolarity > 0):
                sentiment = "positive"
                sentiment_positive = 1
            
            elif (sentimentPolarity < 0):
                sentiment = "negative"
                sentiment_negative = 1
            
            else:
                sentiment = "neutral"
                sentiment_neutral = 1

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
                suburbId = None
                suburb = None

            tweet = {'_id': docid, 'id_str': docid, 'id': docId, 'text': doctext, 'user': docUser,
                    'coordinates': docCoordinates, 'created_at': docTime,
                    'place': docPlace, 'entities': docentities,
                    'addressed': False, 'sentiment': sentiment, 'sentiment_polarity': sentimentPolarity,
                    'sentiment_positive': sentiment_positive, 'sentiment_negative': sentiment_negative,
                    'sentiment_neutral': sentiment_neutral, 'suburb_id': suburbId, 'suburb_name': suburb}
            searchDatabase.database.save(tweet)


    except Exception as e:
        print(e)
        print(Exception)



