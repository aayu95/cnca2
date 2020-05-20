import os
import json
import couchdb
from textblob import TextBlob
from shapely.geometry.point import Point
from shapely.geometry.polygon import Polygon

# Change working directory
os.chdir('C:/GoogleDrive(UniMelb)/UniMelb - Masters Of Data Science - 2018-2019 - Assignment Solutions/Semester 1 2020/Cluster and Cloud Computing - COMP90024_2020SM1/Assignment 2/Github/cnca2/Database')

# Set data file paths
melb_tweets_file = 'Data/twitter-melb.json'

# Connect to CouchDB server
databaseServer = couchdb.Server('http://admin:admin@127.0.0.1:5984/')

# Create database
#database = databaseServer.create('twitter_melb_dump') 
database = databaseServer['twitter_melb_dump']
			
# Import twitter data file into CouchDB
counter = 1
with open(melb_tweets_file, encoding="utf-8") as jsonfile:
	jsonfile.readline()
	for row in jsonfile:
		if counter > 0:
			tweet = row.strip(',\r\n').lower()
			if tweet != ']}':
				tweet_doc = json.loads(tweet)['doc']
				database.save(tweet_doc)				
		counter = counter + 1