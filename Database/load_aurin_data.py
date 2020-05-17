import os
import json
import couchdb
import couchdb.design

# Change working directory
os.chdir('C:/GoogleDrive(UniMelb)/UniMelb - Masters Of Data Science - 2018-2019 - Assignment Solutions/Semester 1 2020/Cluster and Cloud Computing - COMP90024_2020SM1/Assignment 2')

# Connect to CouchDB server
databaseServer = couchdb.Server('http://admin:admin@127.0.0.1:5984/')

# Set data file paths
posDataFile = 'Data/SA2_Qualification_Field_of_Study/data.json'
incomeDataFile = 'Data/SA2_Personal_Income_Distribution/data.json'
socialIndDataFile = 'Data/SA2_Social_Indicators/data.json'
healthDataFile = 'Data/SA2_Self_Assessed_Health/data.json'
lifeSatDataFile = 'Data/SA2_Life_Satisfaction_Indicators/data.json'
chronicDisDataFile = 'Data/SA2_Chronic_Disease/data.json'
countryDataFile = 'Data/SA2_Country_of_Birth/data.json'
ageDataFile = 'Data/SA2_Age_Distribution/data.json'
alcoholDataFile = 'Data/SA2_Health_Risk_Factors/data.json'

def couchdb_data_import(databaseName, dataFilePath):
    # Create database
    database = databaseServer.create(databaseName) 
    
    # Import AURIN data file into CouchDB
    with open(dataFilePath) as jsonfile:
    	aurinData = json.load(jsonfile)['features']
    	for statArea in aurinData:
    		database.save(statArea)
    
print("Importing AURIN data files into CouchDB ...")

print("... Melbourne Profession of Study data")
couchdb_data_import('aurin_pos_data', posDataFile)
    	
print("... Melbourne Income Distribution data")
couchdb_data_import('aurin_income_data', incomeDataFile)

print("... Melbourne Social Indicators data")
couchdb_data_import('aurin_social_ind_data', socialIndDataFile)

print("... Melbourne Self Assessed Health data")
couchdb_data_import('aurin_self_assessed_health_data', healthDataFile)

print("... Melbourne Life Satisfaction data")
couchdb_data_import('aurin_life_sat_data', lifeSatDataFile)

print("... Melbourne Chronic Diseases data")
couchdb_data_import('aurin_chronic_disease_data', chronicDisDataFile)

print("... Melbourne Country of Birth data")
couchdb_data_import('aurin_country_of_birth_data', countryDataFile)

print("... Melbourne Age Distribution data")
couchdb_data_import('aurin_age_data', ageDataFile)

print("... Melbourne Alchol Consumption data")
couchdb_data_import('aurin_alcohol_data', alcoholDataFile)