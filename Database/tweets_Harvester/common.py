# Team 15
# City: Melbourne

# Aayush Mehta (1105081)
# Abhijeet Singh (1094984)
# Anoushka Doctor (1012827)
# Muhammad Atif (924009)
# Siddharth Agarwal (1077275)


import json
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon


# CouchDB Credentials

username = "admin"
password = "qweasdzxc"

# Geolocations of Melbourne

global geoLocations
geoLocations = {}
with open('../Data/melbourne.geojson') as melbournejson:
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


