import json
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon


# CouchDB Credentials

username = "admin"
password = "qweasdzxc"
ipaddress = "172.26.131.40"


# Twitter API Credentials (Abhijeet)

APIKey = 'ZA9y0emLViVNYaxn5kNSdYrFw'
APISecretKey = '8A7SA9DQCa4LsPaA9nFD5ckOXSV1uMc89q2yNrinbhhMFe3sEC'
AccessToken = '1253677550447898626-39ngVfom8ol2byNs5tuyMOFrniQuGY'
AccessTokenSecret = 'KtVLWJNnVw9ah1o8WMZyzYb61QGqADz5k0AGo787XiDjF'


# Geolocations of Melbourne

global geoLocations
geoLocations = {}
with open('/Users/Abhi/Desktop/Search/melbourne.geojson') as melbournejson:
    data = json.load(melbournejson)
    for suburb in data['features']:
        id = suburb['id']
        suburbName = suburb['properties']['SA2_NAME16']
        geoLocations[id] = {}
        geoLocations[id]['name'] = suburbName
        if suburb['geometry']['type'] == 'Polygon':
            geoLocations[id]['type'] = 'polygon'
            coordinatesList = suburb['geometry']['coordinates'][0]
            polygonlist = []
            for coordinates in coordinatesList:
                polygonlist.append((coordinates[0],coordinates[1]))
            polygon = Polygon(polygonlist)
            geoLocations[id]['polygon'] = polygon
        else:
            geoLocations[id]['type'] = 'MultiPolygon'
            geoLocations[id]['polygons'] = []
            for polygonCoordinates in suburb['geometry']['coordinates']:
                polygonlist = []
                for coor in polygonCoordinates[0]:
                    polygonlist.append((coor[0],coor[1]))
                geoLocations[id]['polygons'].append(Polygon(polygonlist))


# Bounding Box for Australia (Streaming API)
australiaBoundingBox = "112.925776, -38.436529, 154.075130, -11.095189"


# Bounding Box for Melbourne (Streaming API)
melbourneBoundingBox = "144.5532,-38.2250,145.5498,-37.5401"


