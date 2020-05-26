/**This file contains the logic for displaying the map with the gradient based on the AURIN datasets provided. A colour-coded legend and the AURIN data being mapped are also promptly displayed */
var flag;
//Render AURIN dataset
function selectData(element) {
    element.addEventListener('click', function () {
        clearData();
        loadData(element.value);
    });
}

//Render Twitter data
function selectTweetData(element) {
    element.addEventListener('change', function () {
        if (this.checked) {
            console.log('hi')
            clearData();
            loadData(element.value);
        }
        else {
            console.log('by')
            clearData();
            loadData(element.value + 'f');
        }

    });
}

//Load boundaries of suburb only once
function loadBoundary() {
    map.data.loadGeoJson('melbourne.geojson', {}, function (feature) {
    });
    // google.maps.event.addListenerOnce(map.data, 'addfeature', function() {
    //         google.maps.event.trigger(document.getElementById('var'), 'change');
    //     });
}

//Load AURIN dataset
function loadData(parameter) {
    var ip;
    const port = 30006;

    function doGET(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // The request is done; did it work?
                if (xhr.status == 200) {
                    // ***Yes, use `xhr.responseText` here***
                    callback(xhr.responseText);
                } else {
                    // ***No, tell the callback the call failed***
                    callback(null);
                }
            }
        };
        xhr.open("GET", path, false);
        xhr.send();
    }

    function handleFileData(fileData) {
        if (!fileData) {
            // Show error
            return;
        }
        ip = fileData.split('\n').shift();
        console.log(ip);
        // Use the file data
    }
    // Do the request
    doGET("./current.txt", handleFileData);
    var file;
    if (parameter === 'late-senti')
        file = 'http://'+ip+':'+port+'/getLateSentimentBySuburb';
    else if (parameter === 'late-sentif')
        file = 'http://'+ip+':'+port+'/getSentimentBySuburb';
    else if (parameter === 'late-tweet')
        file = 'http://'+ip+':'+port+'/getLateTweetCountBySuburb';
    else if (parameter === 'late-tweetf')
        file = 'http://'+ip+':'+port+'/getTweetCountBySuburb';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        var suburb;
        var categoryCount;
        var title;

        var len = data.rows.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < 309; j++) {
                suburb = map.data.getFeatureById(j + 1).getProperty('SA2_NAME16');

                if (suburb.localeCompare(data.rows[i].key) === 0) {
                    if (parameter === 'late-senti' || parameter === 'late-sentif') {
                        flag = 1;
                        categoryCount = data.rows[i].value.polarity_avg.toFixed(2);
                        map.data.getFeatureById(j + 1).setProperty('sentiment', data.rows[i].value.overall_sentiment);
                        map.data.getFeatureById(j + 1).setProperty('positive-count', data.rows[i].value.positive_count);
                        map.data.getFeatureById(j + 1).setProperty('neutral-count', data.rows[i].value.neutral_count);
                        map.data.getFeatureById(j + 1).setProperty('negative-count', data.rows[i].value.negative_count);
                        title = 'Sentiment Analysis';
                    }
                    else if (parameter === 'late-tweet' || parameter === 'late-tweetf') {
                        flag = 0;
                        categoryCount = data.rows[i].value;
                        title = 'Number of Tweets';
                    }
                    if (categoryCount !== -2) {
                        if (categoryCount < varMin) {
                            varMin = categoryCount;
                        }
                        if (categoryCount > varMax) {
                            varMax = categoryCount;
                        }
                    }
                    map.data.getFeatureById(j + 1).setProperty('curr_variable', categoryCount);
                }
            }
            // suburbList.push(suburb[0]);
            //Replace with property name of data to be plotted
        }
        var range;
        if (parameter === 'late-senti' || parameter === 'late-sentif') {
            document.getElementById('var-range-7').textContent = '0.4 - 0.47';
        document.getElementById('var-min').textContent = '-0.73 - 0.064';
        document.getElementById('var-range-1').textContent = '0.064 - 0.1';
        document.getElementById('var-range-2').textContent ='0.1 - 0.12';
        document.getElementById('var-range-3').textContent = '0.12 - 0.14';
        document.getElementById('var-range-4').textContent = '0.14 - 0.2';
        document.getElementById('var-range-5').textContent = '0.2 - 0.3';
        document.getElementById('var-range-6').textContent = '0.3 - 0.4';
        }
        else if(parameter=='late-tweet') {
            document.getElementById('var-range-7').textContent = '7,800-9,817';
        document.getElementById('var-min').textContent = '';
        document.getElementById('var-range-1').textContent = '1 - 200';
        document.getElementById('var-range-2').textContent ='200 - 400';
        document.getElementById('var-range-3').textContent = '400 - 1,000';
        document.getElementById('var-range-4').textContent = '1,000 - 3,800';
        document.getElementById('var-range-5').textContent = '3,800 - 5,000';
        document.getElementById('var-range-6').textContent = '5,000 - 7,800';
        }
        else {
            range = (varMax-varMin)/8
            document.getElementById('var-min').textContent = varMin.toLocaleString()+' - '+(varMin+range).toLocaleString();
        document.getElementById('var-range-1').textContent = (varMin+range).toLocaleString()+' - '+(varMin+(2*range)).toLocaleString();
        document.getElementById('var-range-2').textContent = (varMin+(2*range)).toLocaleString()+' - '+(varMin+(3*range)).toLocaleString();
        document.getElementById('var-range-3').textContent = (varMin+(3*range)).toLocaleString()+' - '+(varMin+(4*range)).toLocaleString();
        document.getElementById('var-range-4').textContent = (varMin+(4*range)).toLocaleString()+' - '+(varMin+(5*range)).toLocaleString();
        document.getElementById('var-range-5').textContent = (varMin+(5*range)).toLocaleString()+' - '+(varMin+(6*range)).toLocaleString();
        document.getElementById('var-range-6').textContent = (varMin+(6*range)).toLocaleString()+' - '+(varMin+(7*range)).toLocaleString();
        document.getElementById('var-range-7').textContent = (varMin+(7*range)).toLocaleString()+' - '+varMax.toLocaleString();
        }
        document.getElementById('legend-title').textContent = title;
        
        if (parameter === 'late-senti' || parameter == 'late-tweet')
            map.setOptions({
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#6b9a76' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1f2835' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#f3d19c' }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{ color: '#2f3948' }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#515c6d' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#17263c' }]
                    }
                ]
            })
        else
            map.setOptions({ styles: null });
        map.data.setStyle(styleFeature);
    };
    xhr.send();
}

//Clears previously set data in order to render new data correctly
function clearData() {
    varMin = Number.MAX_VALUE;
    varMax = -Number.MAX_VALUE;
    map.data.forEach(function (row) {
        row.setProperty('curr_variable', undefined);
    });
    map.data.forEach(function (row) {
        row.setProperty('sentiment', undefined);
    });
    map.data.forEach(function (row) {
        row.setProperty('positive-count', undefined);
    });
    map.data.forEach(function (row) {
        row.setProperty('neutral-count', undefined);
    });
    map.data.forEach(function (row) {
        row.setProperty('negative-count', undefined);
    });
}

//The styling of the map according to the dataset
function styleFeature(feature) {
    //CUSTOMISE ACCORDING TO NUMBER OF COLOURS
    var low = [100, 100, 80];
    var high = [100, 100, 10];
    var diff = (feature.getProperty('curr_variable') - varMin) / (varMax - varMin);
    var colour = [];
    if(flag==0) {
    if (feature.getProperty('curr_variable') >= 7800) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 5;
    }
    else if (feature.getProperty('curr_variable') >= 5000) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 15;
    }
    else if (feature.getProperty('curr_variable') >= 3800) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 25;
    }
    else if (feature.getProperty('curr_variable') >= 1000) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 35;
    }
    else if (feature.getProperty('curr_variable') >= 400) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 55;
    }
    else if (feature.getProperty('curr_variable') >= 200) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 75;
    }
    else if (feature.getProperty('curr_variable') >= 50) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 85;
    }
    else if (feature.getProperty('curr_variable') >= 1) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 95;
    }
}
else {
    if (feature.getProperty('curr_variable') >= 0.4) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 5;
    }
    else if (feature.getProperty('curr_variable') >= 0.3) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 15;
    }
    else if (feature.getProperty('curr_variable') >= 0.2) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 25;
    }
    else if (feature.getProperty('curr_variable') >= 0.14) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 35;
    }
    else if (feature.getProperty('curr_variable') >= 0.12) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 55;
    }
    else if (feature.getProperty('curr_variable') >= 0.1) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 75;
    }
    else if (feature.getProperty('curr_variable') >= 0.064) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 85;
    }
    else if (feature.getProperty('curr_variable') >= -0.073) {
        colour[0] = 100;
        colour[1] = 100;
        colour[2] = 95;
    }
    // for (var i=0; i<3; i++) {
    //     colour[i] = (high[i] - low[i]) * diff + low[i];
    // }

}

    
    var showRow = true;
    if (feature.getProperty('curr_variable') == null ||
        isNaN(feature.getProperty('curr_variable'))) {
        showRow = false;
    }

    var outlineWeight = 0.5, zIndex = 1;
    if (feature.getProperty('state') === 'hover') {
        outlineWeight = zIndex = 2;
    }

    return {
        strokeWeight: outlineWeight,
        strokeColor: '#000',
        zIndex: zIndex,
        fillColor: 'hsl(' + colour[0] + ',' + colour[1] + '%,' + colour[2] + '%)',
        fillOpacity: 0.75,
        visible: showRow
    };
}

//Show apt details when mouse hovers over suburb
function mouseEnter(event) {
    event.feature.setProperty('state', 'hover');
    document.getElementById('data-label').textContent =
        event.feature.getProperty('SA2_NAME16');
    document.getElementById('data-box').style.display = 'block';
    if (event.feature.getProperty('sentiment') !== undefined) {
        document.getElementById('data-value').textContent = "";
        document.getElementById('data-box-senti').style.display = 'block';
        document.getElementById('data-box-senti').style.backgroundColor = 'white';
        document.getElementById('data-box-senti').style.boxShadow = '0 4px 6px -4px #333';
        document.getElementById('data-label-senti').style.display = 'inline-block';
    document.getElementById('data-value-senti').style.display = 'inline-block';
        document.getElementById('data-label-senti').textContent =
            "Sentiment Polarity: "
        document.getElementById('data-value-senti').textContent =
            event.feature.getProperty('curr_variable');
        document.getElementById('data-label-senti-p').textContent =
            "Positive: "
        document.getElementById('data-value-senti-p').textContent =
            event.feature.getProperty('positive-count');
        document.getElementById('data-label-senti-nu').textContent =
            "Neutral: "
        document.getElementById('data-value-senti-nu').textContent =
            event.feature.getProperty('neutral-count');
        document.getElementById('data-label-senti-n').textContent =
            "Negative: "
        document.getElementById('data-value-senti-n').textContent =
            event.feature.getProperty('negative-count');
    }
    else {
        document.getElementById('data-value').textContent = event.feature.getProperty('curr_variable').toLocaleString();
    }
}

function mouseExit(event) {
    if (event.feature.getProperty('sentiment') === undefined) { document.getElementById('data-box-senti').style.display = 'none';
    document.getElementById('data-label-senti').style.display = 'none';
    document.getElementById('data-value-senti').style.display = 'none';
    }
    event.feature.setProperty('state', 'normal');
}