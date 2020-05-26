# Team 15
# City: Melbourne

# Aayush Mehta (1105081)
# Abhijeet Singh (1094984)
# Anoushka Doctor (1012827)
# Muhammad Atif (924009)
# Siddharth Agarwal (1077275)


import os
import json
import couchdb
import datetime
from textblob import TextBlob
from shapely.geometry.point import Point
from shapely.geometry.polygon import Polygon
from tweets_Harvester.common import *

# Set data file paths
melb_tweets_file = 'Data/twitter-melb.json'

try:
	with open("../Common/current.txt", 'r') as current:
		ipaddress = current.readline().strip()
		
	databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress))) 	# Connect to CouchDB server

	# Create database
	database = databaseServer.create('twitter_melb_dump') 

	global geodict
	geodict = {}
	# Load melbourne geo json file to map tweet cordinates to Melbourne Suburbs
	with open('Data/melbourne.geojson') as melbournejson:
		data = json.load(melbournejson)

		for p in data['features']:
			id = p['id']
			name = p['properties']['SA2_NAME16']
			geodict[id] = {}
			geodict[id]['name'] = name
			if p['geometry']['type'] == 'Polygon':
				geodict[id]['type'] = 'polygon'
				coorlists = p['geometry']['coordinates'][0]
				polygonlist = []
				for coor in coorlists:
					polygonlist.append((coor[0],coor[1]))
				polygon = Polygon(polygonlist)
				geodict[id]['polygon'] = polygon
			else:
				geodict[id]['type'] = 'MultiPolygon'
				geodict[id]['polygons'] = []
				for polyCoors in p['geometry']['coordinates']:
					polygonlist = []
					for coor in polyCoors[0]:
						polygonlist.append((coor[0],coor[1]))
					geodict[id]['polygons'].append(Polygon(polygonlist))
					
	# Import twitter data file into CouchDB
	counter = 1
	with open(melb_tweets_file, encoding="utf-8") as jsonfile:
		jsonfile.readline()
		for row in jsonfile:
			if counter > 1393777:
				tweet = row.strip(',\r\n').lower()
				if tweet != ']}':
					tweet_doc = json.loads(tweet)['doc']
					
					# Add sentiment properties to existing tweet documents
					sentimentPolarity = TextBlob(tweet_doc['text']).polarity

					sentiment_positive = 0
					sentiment_negative = 0
					sentiment_neutral  = 0

					if (sentimentPolarity > 0):
						tweet_doc['sentiment'] = "positive"
						sentiment_positive = 1
					elif (sentimentPolarity < 0):
						tweet_doc['sentiment'] = "negative"
						sentiment_negative = 1
					else:
						tweet_doc['sentiment'] = "neutral"
						sentiment_neutral = 1
						
					tweet_doc['sentiment_neutral']  = sentiment_neutral
					tweet_doc['sentiment_negative'] = sentiment_negative
					tweet_doc['sentiment_positive'] = sentiment_positive   
					tweet_doc['sentiment_polarity'] = sentimentPolarity				

					# Get Suburb from tweet cordinates
					try:
						docCoordinates = tweet_doc['coordinates']
						try:
							if (docCoordinates is not None):
								longitude = docCoordinates['coordinates'][0]
								latitude = docCoordinates['coordinates'][1]
								point = Point(longitude, latitude)
								for i in geodict.keys():
									if geodict[i]['type'] == 'polygon':
										if geodict[i]['polygon'].contains(point):
											suburbId = i
											suburb = geodict[suburbId]['name']
											break
									else:
										for polygon in geodict[i]['polygons']:
											if polygon.contains(point):
												suburbId = i
												suburb = geodict[suburbId]['name']
												break
										break
							else:
								suburbId = None
								suburb = None
						except Exception:
							suburb = None

						tweet_doc['suburb_id']   = suburbId
						tweet_doc['suburb_name'] = suburb

						del tweet_doc['_rev']
						
						database.save(tweet_doc)
					
					except Exception as e:
						if hasattr(e, 'message'):
							print(e.message)
						else:
							print(e)
							
			counter = counter + 1
			
except Exception as e:
	with open('searchdabatase_log','a') as f:
		f.write("["+datetime.datetime.now().__str__()+"]"+'\n')