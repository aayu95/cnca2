import json
import couchdb
import couchdb.design
import datetime
from common import *

try:
	with open("../../Common/current.txt", 'r') as current:
		ipaddress = current.readline().strip()
		
	databaseServer = couchdb.Server(("http://%s:%s@%s:5984/" % (username, password, ipaddress))) 	# Connect to CouchDB server

# -------------------------------------------------------------------------------------------------------------------------------------
# 												IMPORT AURIN DATA
# -------------------------------------------------------------------------------------------------------------------------------------

	# Set data file paths
	posDataFile = '../Data/SA2_Qualification_Field_of_Study/data.json'
	incomeDataFile = '../Data/SA2_Personal_Income_Distribution/data.json'
	educationDataFile = '../Data/SA2_Education/data.json'
	healthDataFile = '../Data/SA2_Self_Assessed_Health/data.json'
	lifeSatDataFile = '../Data/SA2_Life_Satisfaction_Indicators/data.json'
	chronicDisDataFile = '../Data/SA2_Chronic_Disease/data.json'
	countryDataFile = '../Data/SA2_Country_of_Birth/data.json'
	ageDataFile = '../Data/SA2_Age_Distribution/data.json'
	alcoholDataFile = '../Data/SA2_Health_Risk_Factors/data.json'

	def couchdb_data_import(databaseName, dataFilePath):
		# Create database
		database = databaseServer.create(databaseName) 
		
		# Import AURIN data file into CouchDB
		with open(dataFilePath) as jsonfile:
			aurinData = json.load(jsonfile)['features']
			for statArea in aurinData:
				database.save(statArea)
		
	couchdb_data_import('aurin_pos', posDataFile)
	couchdb_data_import('aurin_education', educationDataFile)
	couchdb_data_import('aurin_income', incomeDataFile)
	couchdb_data_import('aurin_health', healthDataFile)
	couchdb_data_import('aurin_life_sat', lifeSatDataFile)
	couchdb_data_import('aurin_chronic_disease', chronicDisDataFile)
	couchdb_data_import('aurin_country_of_birth', countryDataFile)
	couchdb_data_import('aurin_age', ageDataFile)
	couchdb_data_import('aurin_alcohol', alcoholDataFile)

	# -------------------------------------------------------------------------------------------------------------------------------------
	# 												CREATE AURIN DATABASE VIEWS
	# -------------------------------------------------------------------------------------------------------------------------------------
		
	countCreativeArtsInSuburb = 'function(doc) { emit(doc.properties.SA2_NAME11, doc.properties.P_Creative_Arts_Tot); }'
	view = couchdb.design.ViewDefinition('aurin', 'countCreativeArtsInSuburb', countCreativeArtsInSuburb)
	view.sync(databaseServer['aurin_pos'])

	countNonSchoolQualificationInSuburb = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties.p_graddip_and_gradcert_total + doc.properties.p_advdip_and_dip_total + doc.properties.p_pgrad_deg_total + doc.properties.p_cert_lev_tot_total + doc.properties.p_bachdeg_total); }'
	view = couchdb.design.ViewDefinition('aurin', 'countNonSchoolQualificationInSuburb', countNonSchoolQualificationInSuburb)
	view.sync(databaseServer['aurin_education'])
			
	meanIncomeInSuburb = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties.mean_aud); }'
	view = couchdb.design.ViewDefinition('aurin', 'meanIncomeInSuburb', meanIncomeInSuburb)
	view.sync(databaseServer['aurin_income'])
			 
	countPoorHealthInSuburb = 'function(doc) { emit(doc.properties.area_name, doc.properties.poor_hlth_me_1_no_3_11_7_13); }'
	view = couchdb.design.ViewDefinition('aurin', 'countPoorHealthInSuburb', countPoorHealthInSuburb)
	view.sync(databaseServer['aurin_health'])
		
	countHighLifeSatisfactionInSuburb = 'function(doc) { emit(doc.properties.sa2_name16, doc.properties._life_satisfaction_70_synth + doc.properties._life_satisfaction_80_synth + doc.properties._life_satisfaction_90_synth + doc.properties._life_satisfaction_100_synth ); }'
	view = couchdb.design.ViewDefinition('aurin', 'countHighLifeSatisfactionInSuburb', countHighLifeSatisfactionInSuburb)
	view.sync(databaseServer['aurin_life_sat'])
		 
	countChronicDiseaseInSuburb = 'function(doc) { emit(doc.properties.area_name, doc.properties.mntl_bh_p_me_1_no_3_11_7_13 + doc.properties.circ_me_1_no_3_11_7_13 + doc.properties.arthritis_me_1_no_3_11_7_13 + doc.properties.musculo_me_1_no_3_11_7_13 + doc.properties.diabetes_me_1_no_3_11_7_13 + doc.properties.hypertens_me_1_no_3_11_7_13 + doc.properties.copd_me_1_no_3_11_7_13 + doc.properties.respirtry_me_1_no_3_11_7_13 + doc.properties.hg_choles_me_1_no_3_11_7_13 + doc.properties.asthma_me_1_no_3_11_7_13); }'
	view = couchdb.design.ViewDefinition('aurin', 'countChronicDiseaseInSuburb', countChronicDiseaseInSuburb)
	view.sync(databaseServer['aurin_chronic_disease'])
		  
	countNationalityInSuburb = "function(doc) {emit(doc.properties.sa2_name16, {'australia_count':doc.properties.australia_p, 'international_count':doc.properties.china_excl_sars_taiwan_p + doc.properties.new_zealand_p + doc.properties.vietnam_p + doc.properties.croatia_p + doc.properties.germany_p + doc.properties.sri_lanka_p + doc.properties.iran_p + doc.properties.united_kingdom_ci_im_p + doc.properties.iraq_p + doc.properties.japan_p + doc.properties.malta_p + doc.properties.singapore_p + doc.properties.fiji_p + doc.properties.poland_p + doc.properties.malaysia_p + doc.properties.united_states_america_p + doc.properties.philippines_p + doc.properties.thailand_p + doc.properties.hong_kong_sar_china_p + doc.properties.tfyrom_p + doc.properties.egypt_p + doc.properties.india_p + doc.properties.canada_p + doc.properties.south_africa_p + doc.properties.greece_p + doc.properties.zimbabwe_p + doc.properties.indonesia_p + doc.properties.ireland_p + doc.properties.italy_p + doc.properties.turkey_p + doc.properties.pakistan_p + doc.properties.lebanon_p + doc.properties.netherlands_p + doc.properties.korea_republic_south_p});}"
	view = couchdb.design.ViewDefinition('aurin', 'countNationalityInSuburb', countNationalityInSuburb)
	view.sync(databaseServer['aurin_country_of_birth'])
		
	countYoungPeopleInSuburb = 'function(doc) { emit(doc.properties.area_name, doc.properties.x15_19_p_1_no_6_13_6_13 + doc.properties.x20_24_p_1_no_6_13_6_13 + doc.properties.x25_29_p_1_no_6_13_6_13 + doc.properties.x30_34_p_1_no_6_13_6_13 + doc.properties.x35_39_p_1_no_6_13_6_13); }'
	view = couchdb.design.ViewDefinition('aurin', 'countYoungPeopleInSuburb', countYoungPeopleInSuburb)
	view.sync(databaseServer['aurin_age'])
		  
	countAlcoholConsumptionInSuburb = 'function(doc) { emit(doc.properties.area_name, doc.properties.alcohol_cons_1_no_3_11_7_13); }'
	view = couchdb.design.ViewDefinition('aurin', 'countAlcoholConsumptionInSuburb', countAlcoholConsumptionInSuburb)
	view.sync(databaseServer['aurin_alcohol'])
		 
	countCreativeArtsInSuburbTop30 = 'function(doc) {if (doc.properties.SA2_NAME11 == "Melbourne" || doc.properties.SA2_NAME11 == "North Melbourne" || doc.properties.SA2_NAME11 == "Southbank" || doc.properties.SA2_NAME11 == "East Melbourne" || doc.properties.SA2_NAME11 == "Richmond (Vic.)" || doc.properties.SA2_NAME11 == "St Kilda" || doc.properties.SA2_NAME11 == "Docklands" || doc.properties.SA2_NAME11 == "Carlton" || doc.properties.SA2_NAME11 == "Melbourne Airport" || doc.properties.SA2_NAME11 == "South Yarra - East" || doc.properties.SA2_NAME11 == "Fitzroy" || doc.properties.SA2_NAME11 == "Prahran - Windsor" || doc.properties.SA2_NAME11 == "South Melbourne" || doc.properties.SA2_NAME11 == "Brunswick" || doc.properties.SA2_NAME11 == "Albert Park" || doc.properties.SA2_NAME11 == "Hawthorn" || doc.properties.SA2_NAME11 == "Kensington (Vic.)" || doc.properties.SA2_NAME11 == "Parkville" || doc.properties.SA2_NAME11 == "Mooroolbark" || doc.properties.SA2_NAME11 == "Skye - Sandhurst" || doc.properties.SA2_NAME11 == "Footscray" || doc.properties.SA2_NAME11 == "Clayton" || doc.properties.SA2_NAME11 == "Yarra Valley" || doc.properties.SA2_NAME11 == "Laverton" || doc.properties.SA2_NAME11 == "Dandenong" || doc.properties.SA2_NAME11 == "Brighton (Vic.)" || doc.properties.SA2_NAME11 == "Collingwood" || doc.properties.SA2_NAME11 == "Burwood" || doc.properties.SA2_NAME11 == "Caulfield - North" || doc.properties.SA2_NAME11 == "Malvern East") { emit(doc.properties.SA2_NAME11, doc.properties.P_Creative_Arts_Tot); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countCreativeArtsInSuburbTop30', countCreativeArtsInSuburbTop30)
	view.sync(databaseServer['aurin_pos'])
		 
	countNonSchoolQualificationInSuburbTop30 = 'function(doc) {if (doc.properties.sa2_name16 == "Melbourne" || doc.properties.sa2_name16 == "North Melbourne" || doc.properties.sa2_name16 == "Southbank" || doc.properties.sa2_name16 == "East Melbourne" || doc.properties.sa2_name16 == "Richmond (Vic.)" || doc.properties.sa2_name16 == "St Kilda" || doc.properties.sa2_name16 == "Docklands" || doc.properties.sa2_name16 == "Carlton" || doc.properties.sa2_name16 == "Melbourne Airport" || doc.properties.sa2_name16 == "South Yarra - East" || doc.properties.sa2_name16 == "Fitzroy" || doc.properties.sa2_name16 == "Prahran - Windsor" || doc.properties.sa2_name16 == "South Melbourne" || doc.properties.sa2_name16 == "Brunswick" || doc.properties.sa2_name16 == "Albert Park" || doc.properties.sa2_name16 == "Hawthorn" || doc.properties.sa2_name16 == "Kensington (Vic.)" || doc.properties.sa2_name16 == "Parkville" || doc.properties.sa2_name16 == "Mooroolbark" || doc.properties.sa2_name16 == "Skye - Sandhurst" || doc.properties.sa2_name16 == "Footscray" || doc.properties.sa2_name16 == "Clayton" || doc.properties.sa2_name16 == "Yarra Valley" || doc.properties.sa2_name16 == "Laverton" || doc.properties.sa2_name16 == "Dandenong" || doc.properties.sa2_name16 == "Brighton (Vic.)" || doc.properties.sa2_name16 == "Collingwood" || doc.properties.sa2_name16 == "Burwood" || doc.properties.sa2_name16 == "Caulfield - North" || doc.properties.sa2_name16 == "Malvern East") { emit(doc.properties.sa2_name16, doc.properties.p_graddip_and_gradcert_total + doc.properties.p_advdip_and_dip_total + doc.properties.p_pgrad_deg_total + doc.properties.p_cert_lev_tot_total + doc.properties.p_bachdeg_total); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countNonSchoolQualificationInSuburbTop30', countNonSchoolQualificationInSuburbTop30)
	view.sync(databaseServer['aurin_education'])
		 
	meanIncomeInSuburbTop30 = 'function(doc) {if (doc.properties.sa2_name16 == "Melbourne" || doc.properties.sa2_name16 == "North Melbourne" || doc.properties.sa2_name16 == "Southbank" || doc.properties.sa2_name16 == "East Melbourne" || doc.properties.sa2_name16 == "Richmond (Vic.)" || doc.properties.sa2_name16 == "St Kilda" || doc.properties.sa2_name16 == "Docklands" || doc.properties.sa2_name16 == "Carlton" || doc.properties.sa2_name16 == "Melbourne Airport" || doc.properties.sa2_name16 == "South Yarra - East" || doc.properties.sa2_name16 == "Fitzroy" || doc.properties.sa2_name16 == "Prahran - Windsor" || doc.properties.sa2_name16 == "South Melbourne" || doc.properties.sa2_name16 == "Brunswick" || doc.properties.sa2_name16 == "Albert Park" || doc.properties.sa2_name16 == "Hawthorn" || doc.properties.sa2_name16 == "Kensington (Vic.)" || doc.properties.sa2_name16 == "Parkville" || doc.properties.sa2_name16 == "Mooroolbark" || doc.properties.sa2_name16 == "Skye - Sandhurst" || doc.properties.sa2_name16 == "Footscray" || doc.properties.sa2_name16 == "Clayton" || doc.properties.sa2_name16 == "Yarra Valley" || doc.properties.sa2_name16 == "Laverton" || doc.properties.sa2_name16 == "Dandenong" || doc.properties.sa2_name16 == "Brighton (Vic.)" || doc.properties.sa2_name16 == "Collingwood" || doc.properties.sa2_name16 == "Burwood" || doc.properties.sa2_name16 == "Caulfield - North" || doc.properties.sa2_name16 == "Malvern East") { emit(doc.properties.sa2_name16, doc.properties.mean_aud); };}'
	view = couchdb.design.ViewDefinition('aurin', 'meanIncomeInSuburbTop30', meanIncomeInSuburbTop30)
	view.sync(databaseServer['aurin_income'])
		 
	countPoorHealthInSuburbTop30 = 'function(doc) {if (doc.properties.area_name == "Melbourne" || doc.properties.area_name == "North Melbourne" || doc.properties.area_name == "Southbank" || doc.properties.area_name == "East Melbourne" || doc.properties.area_name == "Richmond (Vic.)" || doc.properties.area_name == "St Kilda" || doc.properties.area_name == "Docklands" || doc.properties.area_name == "Carlton" || doc.properties.area_name == "Melbourne Airport" || doc.properties.area_name == "South Yarra - East" || doc.properties.area_name == "Fitzroy" || doc.properties.area_name == "Prahran - Windsor" || doc.properties.area_name == "South Melbourne" || doc.properties.area_name == "Brunswick" || doc.properties.area_name == "Albert Park" || doc.properties.area_name == "Hawthorn" || doc.properties.area_name == "Kensington (Vic.)" || doc.properties.area_name == "Parkville" || doc.properties.area_name == "Mooroolbark" || doc.properties.area_name == "Skye - Sandhurst" || doc.properties.area_name == "Footscray" || doc.properties.area_name == "Clayton" || doc.properties.area_name == "Yarra Valley" || doc.properties.area_name == "Laverton" || doc.properties.area_name == "Dandenong" || doc.properties.area_name == "Brighton (Vic.)" || doc.properties.area_name == "Collingwood" || doc.properties.area_name == "Burwood" || doc.properties.area_name == "Caulfield - North" || doc.properties.area_name == "Malvern East") { emit(doc.properties.area_name, doc.properties.poor_hlth_me_1_no_3_11_7_13); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countPoorHealthInSuburbTop30', countPoorHealthInSuburbTop30)
	view.sync(databaseServer['aurin_health'])
	  
	countHighLifeSatisfactionInSuburbTop30 = 'function(doc) {if (doc.properties.sa2_name16 == "Melbourne" || doc.properties.sa2_name16 == "North Melbourne" || doc.properties.sa2_name16 == "Southbank" || doc.properties.sa2_name16 == "East Melbourne" || doc.properties.sa2_name16 == "Richmond (Vic.)" || doc.properties.sa2_name16 == "St Kilda" || doc.properties.sa2_name16 == "Docklands" || doc.properties.sa2_name16 == "Carlton" || doc.properties.sa2_name16 == "Melbourne Airport" || doc.properties.sa2_name16 == "South Yarra - East" || doc.properties.sa2_name16 == "Fitzroy" || doc.properties.sa2_name16 == "Prahran - Windsor" || doc.properties.sa2_name16 == "South Melbourne" || doc.properties.sa2_name16 == "Brunswick" || doc.properties.sa2_name16 == "Albert Park" || doc.properties.sa2_name16 == "Hawthorn" || doc.properties.sa2_name16 == "Kensington (Vic.)" || doc.properties.sa2_name16 == "Parkville" || doc.properties.sa2_name16 == "Mooroolbark" || doc.properties.sa2_name16 == "Skye - Sandhurst" || doc.properties.sa2_name16 == "Footscray" || doc.properties.sa2_name16 == "Clayton" || doc.properties.sa2_name16 == "Yarra Valley" || doc.properties.sa2_name16 == "Laverton" || doc.properties.sa2_name16 == "Dandenong" || doc.properties.sa2_name16 == "Brighton (Vic.)" || doc.properties.sa2_name16 == "Collingwood" || doc.properties.sa2_name16 == "Burwood" || doc.properties.sa2_name16 == "Caulfield - North" || doc.properties.sa2_name16 == "Malvern East") { emit(doc.properties.sa2_name16, doc.properties._life_satisfaction_70_synth + doc.properties._life_satisfaction_80_synth + doc.properties._life_satisfaction_90_synth + doc.properties._life_satisfaction_100_synth); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countHighLifeSatisfactionInSuburbTop30', countHighLifeSatisfactionInSuburbTop30)
	view.sync(databaseServer['aurin_life_sat'])
		 
	countChronicDiseaseInSuburbTop30 = 'function(doc) {if (doc.properties.area_name == "Melbourne" || doc.properties.area_name == "North Melbourne" || doc.properties.area_name == "Southbank" || doc.properties.area_name == "East Melbourne" || doc.properties.area_name == "Richmond (Vic.)" || doc.properties.area_name == "St Kilda" || doc.properties.area_name == "Docklands" || doc.properties.area_name == "Carlton" || doc.properties.area_name == "Melbourne Airport" || doc.properties.area_name == "South Yarra - East" || doc.properties.area_name == "Fitzroy" || doc.properties.area_name == "Prahran - Windsor" || doc.properties.area_name == "South Melbourne" || doc.properties.area_name == "Brunswick" || doc.properties.area_name == "Albert Park" || doc.properties.area_name == "Hawthorn" || doc.properties.area_name == "Kensington (Vic.)" || doc.properties.area_name == "Parkville" || doc.properties.area_name == "Mooroolbark" || doc.properties.area_name == "Skye - Sandhurst" || doc.properties.area_name == "Footscray" || doc.properties.area_name == "Clayton" || doc.properties.area_name == "Yarra Valley" || doc.properties.area_name == "Laverton" || doc.properties.area_name == "Dandenong" || doc.properties.area_name == "Brighton (Vic.)" || doc.properties.area_name == "Collingwood" || doc.properties.area_name == "Burwood" || doc.properties.area_name == "Caulfield - North" || doc.properties.area_name == "Malvern East") { emit(doc.properties.area_name, doc.properties.mntl_bh_p_me_1_no_3_11_7_13 + doc.properties.circ_me_1_no_3_11_7_13 + doc.properties.arthritis_me_1_no_3_11_7_13 + doc.properties.musculo_me_1_no_3_11_7_13 + doc.properties.diabetes_me_1_no_3_11_7_13 + doc.properties.hypertens_me_1_no_3_11_7_13 + doc.properties.copd_me_1_no_3_11_7_13 + doc.properties.respirtry_me_1_no_3_11_7_13 + doc.properties.hg_choles_me_1_no_3_11_7_13 + doc.properties.asthma_me_1_no_3_11_7_13); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countChronicDiseaseInSuburbTop30', countChronicDiseaseInSuburbTop30)
	view.sync(databaseServer['aurin_chronic_disease'])
		
	countNationalityInSuburbTop30 = 'function(doc) {if (doc.properties.sa2_name16 == "Melbourne" || doc.properties.sa2_name16 == "North Melbourne" || doc.properties.sa2_name16 == "Southbank" || doc.properties.sa2_name16 == "East Melbourne" || doc.properties.sa2_name16 == "Richmond (Vic.)" || doc.properties.sa2_name16 == "St Kilda" || doc.properties.sa2_name16 == "Docklands" || doc.properties.sa2_name16 == "Carlton" || doc.properties.sa2_name16 == "Melbourne Airport" || doc.properties.sa2_name16 == "South Yarra - East" || doc.properties.sa2_name16 == "Fitzroy" || doc.properties.sa2_name16 == "Prahran - Windsor" || doc.properties.sa2_name16 == "South Melbourne" || doc.properties.sa2_name16 == "Brunswick" || doc.properties.sa2_name16 == "Albert Park" || doc.properties.sa2_name16 == "Hawthorn" || doc.properties.sa2_name16 == "Kensington (Vic.)" || doc.properties.sa2_name16 == "Parkville" || doc.properties.sa2_name16 == "Mooroolbark" || doc.properties.sa2_name16 == "Skye - Sandhurst" || doc.properties.sa2_name16 == "Footscray" || doc.properties.sa2_name16 == "Clayton" || doc.properties.sa2_name16 == "Yarra Valley" || doc.properties.sa2_name16 == "Laverton" || doc.properties.sa2_name16 == "Dandenong" || doc.properties.sa2_name16 == "Brighton (Vic.)" || doc.properties.sa2_name16 == "Collingwood" || doc.properties.sa2_name16 == "Burwood" || doc.properties.sa2_name16 == "Caulfield - North" || doc.properties.sa2_name16 == "Malvern East") { emit(doc.properties.sa2_name16, {"australia_count":doc.properties.australia_p, "international_count":doc.properties.china_excl_sars_taiwan_p + doc.properties.new_zealand_p + doc.properties.vietnam_p + doc.properties.croatia_p + doc.properties.germany_p + doc.properties.sri_lanka_p + doc.properties.iran_p + doc.properties.united_kingdom_ci_im_p + doc.properties.iraq_p + doc.properties.japan_p + doc.properties.malta_p + doc.properties.singapore_p + doc.properties.fiji_p + doc.properties.poland_p + doc.properties.malaysia_p + doc.properties.united_states_america_p + doc.properties.philippines_p + doc.properties.thailand_p + doc.properties.hong_kong_sar_china_p + doc.properties.tfyrom_p + doc.properties.egypt_p + doc.properties.india_p + doc.properties.canada_p + doc.properties.south_africa_p + doc.properties.greece_p + doc.properties.zimbabwe_p + doc.properties.indonesia_p + doc.properties.ireland_p + doc.properties.italy_p + doc.properties.turkey_p + doc.properties.pakistan_p + doc.properties.lebanon_p + doc.properties.netherlands_p + doc.properties.korea_republic_south_p}); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countNationalityInSuburbTop30', countNationalityInSuburbTop30)
	view.sync(databaseServer['aurin_country_of_birth'])
		 
	countYoungPeopleInSuburbTop30 = 'function(doc) {if (doc.properties.area_name == "Melbourne" || doc.properties.area_name == "North Melbourne" || doc.properties.area_name == "Southbank" || doc.properties.area_name == "East Melbourne" || doc.properties.area_name == "Richmond (Vic.)" || doc.properties.area_name == "St Kilda" || doc.properties.area_name == "Docklands" || doc.properties.area_name == "Carlton" || doc.properties.area_name == "Melbourne Airport" || doc.properties.area_name == "South Yarra - East" || doc.properties.area_name == "Fitzroy" || doc.properties.area_name == "Prahran - Windsor" || doc.properties.area_name == "South Melbourne" || doc.properties.area_name == "Brunswick" || doc.properties.area_name == "Albert Park" || doc.properties.area_name == "Hawthorn" || doc.properties.area_name == "Kensington (Vic.)" || doc.properties.area_name == "Parkville" || doc.properties.area_name == "Mooroolbark" || doc.properties.area_name == "Skye - Sandhurst" || doc.properties.area_name == "Footscray" || doc.properties.area_name == "Clayton" || doc.properties.area_name == "Yarra Valley" || doc.properties.area_name == "Laverton" || doc.properties.area_name == "Dandenong" || doc.properties.area_name == "Brighton (Vic.)" || doc.properties.area_name == "Collingwood" || doc.properties.area_name == "Burwood" || doc.properties.area_name == "Caulfield - North" || doc.properties.area_name == "Malvern East") { emit(doc.properties.area_name, doc.properties.x15_19_p_1_no_6_13_6_13 + doc.properties.x20_24_p_1_no_6_13_6_13 + doc.properties.x25_29_p_1_no_6_13_6_13 + doc.properties.x30_34_p_1_no_6_13_6_13 + doc.properties.x35_39_p_1_no_6_13_6_13); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countYoungPeopleInSuburbTop30', countYoungPeopleInSuburbTop30)
	view.sync(databaseServer['aurin_age'])
		
	countAlcoholConsumptionInSuburbTop30 = 'function(doc) {if (doc.properties.area_name == "Melbourne" || doc.properties.area_name == "North Melbourne" || doc.properties.area_name == "Southbank" || doc.properties.area_name == "East Melbourne" || doc.properties.area_name == "Richmond (Vic.)" || doc.properties.area_name == "St Kilda" || doc.properties.area_name == "Docklands" || doc.properties.area_name == "Carlton" || doc.properties.area_name == "Melbourne Airport" || doc.properties.area_name == "South Yarra - East" || doc.properties.area_name == "Fitzroy" || doc.properties.area_name == "Prahran - Windsor" || doc.properties.area_name == "South Melbourne" || doc.properties.area_name == "Brunswick" || doc.properties.area_name == "Albert Park" || doc.properties.area_name == "Hawthorn" || doc.properties.area_name == "Kensington (Vic.)" || doc.properties.area_name == "Parkville" || doc.properties.area_name == "Mooroolbark" || doc.properties.area_name == "Skye - Sandhurst" || doc.properties.area_name == "Footscray" || doc.properties.area_name == "Clayton" || doc.properties.area_name == "Yarra Valley" || doc.properties.area_name == "Laverton" || doc.properties.area_name == "Dandenong" || doc.properties.area_name == "Brighton (Vic.)" || doc.properties.area_name == "Collingwood" || doc.properties.area_name == "Burwood" || doc.properties.area_name == "Caulfield - North" || doc.properties.area_name == "Malvern East") { emit(doc.properties.area_name, doc.properties.alcohol_cons_1_no_3_11_7_13); };}'
	view = couchdb.design.ViewDefinition('aurin', 'countAlcoholConsumptionInSuburbTop30', countAlcoholConsumptionInSuburbTop30)
	view.sync(databaseServer['aurin_alcohol'])

except Exception as e:
	with open('searchdabatase_log','a') as f:
		f.write("["+datetime.datetime.now().__str__()+"]"+'\n')
		f.write(str(e)+'\n')