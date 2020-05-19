import os
import json
import couchdb
import couchdb.design

# Change working directory
os.chdir('C:/GoogleDrive(UniMelb)/UniMelb - Masters Of Data Science - 2018-2019 - Assignment Solutions/Semester 1 2020/Cluster and Cloud Computing - COMP90024_2020SM1/Assignment 2')

# Connect to CouchDB server
databaseServer = couchdb.Server('http://admin:admin@127.0.0.1:5984/')

# -------------------------------------------------------------------------------------------------------------------------------------
# 												CREATE AURIN DATABASE VIEWS
# -------------------------------------------------------------------------------------------------------------------------------------

print("Creating Database views on Aurin data ...")

print("... Suburb wise creative arts count view")       
getCreativeArtsCount = 'function(doc) { emit(doc.properties.SA2_NAME11, doc.properties.P_Creative_Arts_Tot); }'
view = couchdb.design.ViewDefinition('aurin', 'creativeArtsCount', getCreativeArtsCount)
view.sync(databaseServer['aurin_pos_data'])
		
print("... Suburb wise mean income view")       
getIncomeMean = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties.mean_aud); }'
view = couchdb.design.ViewDefinition('aurin', 'meanIncome', getIncomeMean)
view.sync(databaseServer['aurin_income_data'])
	
print("... Suburb wise degree/diploma/certificate holder count view")       
getEducationCount = 'function(doc) { emit(doc.properties.sa2_names, doc.properties.num_of_p_aged_15plus_deg_dip_and_cerificate); }'
view = couchdb.design.ViewDefinition('aurin', 'degreeDiplomaCertificateCount', getEducationCount)
view.sync(databaseServer['aurin_social_ind_data'])

print("... Suburb wise poor health status count view")       
getHealthStatusCount = 'function(doc) { emit(doc.properties.sa2_names, doc.properties.num_of_p_aged_15plus_in_poor_hlth_synt_est); }'
view = couchdb.design.ViewDefinition('aurin', 'poorHealthStatusCount', getHealthStatusCount)
view.sync(databaseServer['aurin_social_ind_data'])

print("... Suburb wise high psychological stress count view")       
getStressCount = 'function(doc) { emit(doc.properties.sa2_names, doc.properties.num_of_p_aged_15plus_in_hi_kessler_synt_est); }'
view = couchdb.design.ViewDefinition('aurin', 'highStressCount', getStressCount)
view.sync(databaseServer['aurin_social_ind_data'])

print("... Suburb wise mean social and economic well being view")       
getSocioEconomicWellBeingMean = 'function(doc) { emit(doc.properties.sa2_names, doc.properties.pos_soc_and_emo_welb_avg_in_aged_15plus_synt_est); }'
view = couchdb.design.ViewDefinition('aurin', 'meanSocioEconomicWellBeing', getSocioEconomicWellBeingMean)
view.sync(databaseServer['aurin_social_ind_data'])
     
print("... Suburb wise self-assessed poor health count view")       
getSelfAssessedPoorHealthCount = 'function(doc) { emit(doc.properties.area_name, doc.properties.poor_hlth_me_1_no_3_11_7_13); }'
view = couchdb.design.ViewDefinition('aurin', 'selfAssessedPoorHealthCount', getSelfAssessedPoorHealthCount)
view.sync(databaseServer['aurin_self_assessed_health_data'])

print("... Suburb wise life satisfaction view")       
getLifeSatisfactionCount = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties._life_satisfaction_70_synth + doc.properties._life_satisfaction_80_synth + doc.properties._life_satisfaction_90_synth + doc.properties._life_satisfaction_100_synth ); }'
view = couchdb.design.ViewDefinition('aurin', 'highLifeSatisfactionCount-70Above', getLifeSatisfactionCount)
view.sync(databaseServer['aurin_life_sat_data'])

print("... Suburb wise chronic disease view")       
getChronicDiseaseCount = 'function(doc) { emit(doc.properties.area_name, doc.properties.mntl_bh_p_me_1_no_3_11_7_13 + doc.properties.circ_me_1_no_3_11_7_13 + doc.properties.arthritis_me_1_no_3_11_7_13 + doc.properties.musculo_me_1_no_3_11_7_13 + doc.properties.diabetes_me_1_no_3_11_7_13 + doc.properties.hypertens_me_1_no_3_11_7_13 + doc.properties.copd_me_1_no_3_11_7_13 + doc.properties.respirtry_me_1_no_3_11_7_13 + doc.properties.hg_choles_me_1_no_3_11_7_13 + doc.properties.asthma_me_1_no_3_11_7_13); }'
view = couchdb.design.ViewDefinition('aurin', 'chronicDiseaseCount', getChronicDiseaseCount)
view.sync(databaseServer['aurin_chronic_disease_data'])

print("... Suburb wise country of birth view")       
getCountryBirthCount = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties.india_p); }'
view = couchdb.design.ViewDefinition('aurin', 'countryBirthCount', getCountryBirthCount)
view.sync(databaseServer['aurin_country_of_birth_data'])

print("... Suburb wise age count view")       
getAgeCount = 'function(doc) { emit(doc.properties.area_name, doc.properties.x15_19_p_1_no_6_13_6_13 + doc.properties.x20_24_p_1_no_6_13_6_13 + doc.properties.x25_29_p_1_no_6_13_6_13 + doc.properties.x30_34_p_1_no_6_13_6_13 + doc.properties.x35_39_p_1_no_6_13_6_13); }'
view = couchdb.design.ViewDefinition('aurin', 'ageCount-15To40', getAgeCount)
view.sync(databaseServer['aurin_age_data'])
 
print("... Suburb wise alchohol count view")       
getAlcoholData = 'function(doc) { emit(doc.properties.area_name, doc.properties.alcohol_cons_1_no_3_11_7_13); }'
view = couchdb.design.ViewDefinition('aurin', 'alcoholCount', getAlcoholData)
view.sync(databaseServer['aurin_alcohol_data'])

# -------------------------------------------------------------------------------------------------------------------------------------
# 												CREATE TWITTER DATABASE VIEWS
# -------------------------------------------------------------------------------------------------------------------------------------

print("... Suburb wise tweets git statsentiment view")
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
view.sync(databaseServer['twitter_melb_dump_small'])

