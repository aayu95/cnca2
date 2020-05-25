/**This file contains the logic for displaying the map with the gradient based on the AURIN datasets provided. A colour-coded legend and the AURIN data being mapped are also promptly displayed */

//Render AURIN dataset
function selectData(element) {
    element.addEventListener('click', function() {
        clearData();
        loadData(element.value);
    });      
}

//Render Twitter data
function selectTweetData(element) {
    element.addEventListener('change', function() {
        if(this.checked) {
            console.log('hi')
            clearData();
            loadData(element.value);
        }
        else {
            console.log('by')
            clearData();
            loadData(element.value+'f');
        }
       
    });
}

//Load boundaries of suburb only once
function loadBoundary() {
    map.data.loadGeoJson('melbourne.geojson', {}, function(feature){
    });
    // google.maps.event.addListenerOnce(map.data, 'addfeature', function() {
    //         google.maps.event.trigger(document.getElementById('var'), 'change');
    //     });
}

//Load AURIN dataset
function loadData(parameter) {
    var file;
    if(parameter==='late-senti')
        file='http://localhost:3000/getLateSentimentBySuburb';
    else if(parameter==='late-sentif')
        file='http://localhost:3000/getSentimentBySuburb';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        var suburb;
        var categoryCount;
        var title;
        var item=[];
        var newList = [];
        //var list = suburbList();
        
        // for(var i=0; i<list.result.length; i++) {
        //     item=list.result[i].key.split(',');
        //     newList.push({"name": item[0], "sentiment": item[1], "value": list.result[i].value.toString()});
        // }
        // for(var i=0; i<newList.length; i++) {
        //     for(var j=0; j<newList.length; j++) {
        //         if(i===j)
        //             continue;
        //         if(newList[i].name===newList[j].name){
        //             newList[j].sentiment+=','+newList[i].sentiment;
        //             newList[j].value+=','+newList[i].value;
        //             newList.splice(i,1);
        //         }
        //     }
        // }
        var len;
        len=data.rows.length;
        for(var i=0; i<len; i++) { //Iterate over length of data!
            for(var j=0; j<309; j++) {
                suburb=map.data.getFeatureById(j+1).getProperty('SA2_NAME16');
                
                if(suburb.localeCompare(data.rows[i].key)===0) {
                    if(parameter === 'creative-people') {
                        title='Number of Creative People'
                        categoryCount = data.features[i].properties.p_crtve_arts_tot;
                    }
                    if(parameter === 'income'){
                        if (data.features[i].properties.median_aud===null){
                            categoryCount = -2;
                        }
                        else{
                            categoryCount = data.features[i].properties.mean_aud;
                        }
                        title='Mean Income';
                    }
                    if(parameter === 'late-senti'|| parameter==='late-sentif'){
                        categoryCount = data.rows[i].value.polarity_avg; 
                        map.data.getFeatureById(j+1).setProperty('sentiment', data.rows[i].value.overall_sentiment);
                        map.data.getFeatureById(j+1).setProperty('positive-count', data.rows[i].value.positive_count); 
                        map.data.getFeatureById(j+1).setProperty('neutral-count', data.rows[i].value.neutral_count); 
                        map.data.getFeatureById(j+1).setProperty('negative-count', data.rows[i].value.negative_count); 
                        title='Sentiment Analysis';
                    }
                    if(categoryCount!==-2) {
                        if(categoryCount<varMin) {
                            varMin=categoryCount;
                        }
                        if(categoryCount>varMax) {
                            varMax=categoryCount;
                        }
                    }
                    map.data.getFeatureById(j+1).setProperty('curr_variable', categoryCount);
                }
            }
            // suburbList.push(suburb[0]);
            //Replace with property name of data to be plotted
        }
        var range;
        if(parameter==='late-senti'||parameter==='late-sentif') {
            range = parseFloat((varMax-varMin)/5);
        }
        else {
            range = parseInt((varMax-varMin)/5);
        }
        document.getElementById('legend-title').textContent = title;
        document.getElementById('var-min').textContent = varMin.toLocaleString()+' - '+(varMin+range).toLocaleString();
        document.getElementById('var-range-1').textContent = (varMin+range).toLocaleString()+' - '+(varMin+(2*range)).toLocaleString();
        document.getElementById('var-range-2').textContent = (varMin+(2*range)).toLocaleString()+' - '+(varMin+(3*range)).toLocaleString();
        document.getElementById('var-range-3').textContent = (varMin+(3*range)).toLocaleString()+' - '+(varMin+(4*range)).toLocaleString();
        document.getElementById('var-max').textContent = (varMin+(4*range)).toLocaleString()+ ' - '+varMax.toLocaleString();
        map.data.setStyle(styleFeature);
    };
    xhr.send();
}

// function suburbList(){
//     var result = [];
//     $.ajax({
//         url: 'sentiment-value.json',
//         dataType: 'json',
//         success: function(data) {result=data;},
//         async: false
//     });
//     return result;
//     //var marker = new google.maps.Marker({position: uluru, map: map});
// }

//Clears previously set data in order to render new data correctly
function clearData() {
    varMin = Number.MAX_VALUE;
    varMax = -Number.MAX_VALUE;
    map.data.forEach(function(row) {
        row.setProperty('curr_variable', undefined);
    });
    map.data.forEach(function(row) {
        row.setProperty('sentiment', undefined);
    });
    map.data.forEach(function(row) {
        row.setProperty('positive-count', undefined);
    });
    map.data.forEach(function(row) {
        row.setProperty('neutral-count', undefined);
    });
    map.data.forEach(function(row) {
        row.setProperty('negative-count', undefined);
    });
}

//The styling of the map according to the dataset
function styleFeature(feature) {
    //CUSTOMISE ACCORDING TO NUMBER OF COLOURS
    var low = [35, 100, 85];
    var high = [35, 100, 5];
    var diff = (feature.getProperty('curr_variable')-varMin) / (varMax - varMin);
    var colour = [];
    for (var i=0; i<3; i++) {
        colour[i] = (high[i] - low[i]) * diff + low[i];
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
    visible:showRow
    };
}

//Show apt details when mouse hovers over suburb
function mouseEnter(event) {
    event.feature.setProperty('state', 'hover');
    document.getElementById('data-label').textContent =
    event.feature.getProperty('SA2_NAME16');
    document.getElementById('data-value').textContent =
    event.feature.getProperty('curr_variable').toLocaleString();
    document.getElementById('data-box').style.display = 'block';
    if(event.feature.getProperty('sentiment')!==undefined) {
        document.getElementById('data-box-senti').style.display = 'block';
        document.getElementById('data-box-senti').style.backgroundColor = 'white';
        document.getElementById('data-box-senti').style.boxShadow = '0 4px 6px -4px #333';
        document.getElementById('data-label-senti').textContent =
        "Overall Sentiment: "
        document.getElementById('data-value-senti').textContent =
        event.feature.getProperty('sentiment');
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
}

function mouseExit(event) {
    if(event.feature.getProperty('sentiment')===undefined) {document.getElementById('data-box-senti').style.display = 'none';}
    event.feature.setProperty('state', 'normal');
}