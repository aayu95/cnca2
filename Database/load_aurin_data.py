import os
import json
import couchdb
import couchdb.design

# Change working directory
os.chdir('C:/GoogleDrive(UniMelb)/UniMelb - Masters Of Data Science - 2018-2019 - Assignment Solutions/Semester 1 2020/Cluster and Cloud Computing - COMP90024_2020SM1/Assignment 2')

# Connect to CouchDB server
databaseServer = couchdb.Server('http://admin:admin@127.0.0.1:5984/')

def couchdb_data_import(databaseName, dataFilePath):
    # Create database
    database = databaseServer.create(databaseName) 
    
    # Import AURIN data file into CouchDB
    with open(dataFilePath) as jsonfile:
    	aurinData = json.load(jsonfile)['features']
    	for statArea in aurinData:
    		database.save(statArea)
    
