function selectData(element) {
    element.addEventListener('click', function() {
        clearData();
        loadData(element.value);
    });      
}

function loadBoundary() {
    map.data.loadGeoJson('melbourne.geojson', {}, function(feature){
        // console.log(map.data.getFeatureById(1).getProperty("SA2_NAME16"));
    });
    // google.maps.event.addListenerOnce(map.data, 'addfeature', function() {
    //         google.maps.event.trigger(document.getElementById('var'), 'change');
    //     });
}

function loadData(parameter) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', parameter + '.json');
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText);
        var suburb;
        var categoryCount;
        var id;
        var title;
        for(var i=0; i<309; i++) {
            //Replace with name of suburb
            id = i+1;
            suburb=data.features[i].properties.sa2_name16;
            // suburbList.push(suburb[0]);
            //Replace with property name of data to be plotted
            if(parameter === 'creative-people') {
                title='Number of Creative People'
                categoryCount = data.features[i].properties.p_crtve_arts_tot;
            }
            if(parameter === 'income'){
                if (data.features[i].properties.median_aud===null){
                    categoryCount = -1;
                }
                else{
                    categoryCount = data.features[i].properties.mean_aud;
                }
                title='Mean Income';
            }
            if(categoryCount!==-1) {
                if(categoryCount<varMin) {
                    varMin=categoryCount;
                }
                if(categoryCount>varMax) {
                    varMax=categoryCount;
                }
            }
            map.data.getFeatureById(id).setProperty('curr_variable', categoryCount);
        }
        const range = parseInt((varMax-varMin)/5);
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

function clearData() {
    varMin = Number.MAX_VALUE;
    varMax = -Number.MAX_VALUE;
    map.data.forEach(function(row) {
        row.setProperty('curr_variable', undefined);
    });
}

function styleFeature(feature) {
    //CUSTOMISE ACCORDING TO NUMBER OF COLOURS
    var low = [35, 100, 85];
    var high = [35, 100, 5];
    var diff = (feature.getProperty('curr_variable')-varMin) / (varMax - varMin);
    var colour = [];
    for (var i=0; i<3; i++) {
        colour[i] = (high[i] - low[i]) * diff + low[i];
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
    fillOpacity: 0.75
    };
}

function mouseEnter(event) {
    event.feature.setProperty('state', 'hover');
    document.getElementById('data-label').textContent =
    event.feature.getProperty('SA2_NAME16');
    document.getElementById('data-value').textContent =
    event.feature.getProperty('curr_variable').toLocaleString();
    document.getElementById('data-box').style.display = 'block';
}

function mouseExit(event) {
    event.feature.setProperty('state', 'normal');
}