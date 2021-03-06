var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley", "Collingwood"];
function renderBarGraph(parameter) {
    d3.select("svg").remove();
    var formatNum = d3.format(".1f");
    var file, id, yTitle;
    var ip;
    const port = 30000;

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

    if (parameter === 'age') {
        file = 'http://' + ip + ':' + port + '/getAurinAgeData';
        id = '#barGraph';
        yTitle = "Population (Aged 15-40)";
    }
    else if (parameter === 'alcohol') {
        file = 'http://' + ip + ':' + port +'/getAurinAlcoholData';
        id = '#alcoholBarGraph';
        yTitle = "Average Alcohol Consumption";
    }
    else if (parameter === 'disease') {
        file = 'http://' + ip + ':' + port +'/getAurinDiseaseData';
        id = '#diseaseBarGraph';
        yTitle = "Disease Count";
    }
    else if (parameter === 'health') {
        file = 'http://' + ip + ':' + port +'/getAurinHealthData';
        id = '#healthBarGraph';
        yTitle = "Number of healthy people";
    }
    else if (parameter === 'income') {
        file = 'http://' + ip + ':' + port +'/getAurinIncomeData';
        id = '#incomeBarGraph';
        yTitle = "Income";
    }
    else if (parameter === 'life') {
        file = 'http://' + ip + ':' + port +'/getAurinLifeSatisfactionData';
        id = '#lifeBarGraph';
        yTitle = "Life Satisfaction measure";
    }
    else if (parameter === 'creative') {
        file = 'http://' + ip + ':' + port +'/getAurinCreativityData';
        id = '#creativeBarGraph';
        yTitle = "Number of creative people";
    }
    else if (parameter === 'nation') {
        file = 'http://' + ip + ':' + port +'/getAurinNationalityData';
        id = '#nationBarGraph';
        yTitle = "Number of foreign people";
    }
    var line = 'http://' + ip + ':' + port +'/getLateTweetCountBySuburb';
    d3.select("svg").remove();
    var margin = { top: 30, right: 20, bottom: 80, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);
    var y1 = d3.scale.linear().range([height, 0]).nice();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var yAxisRight = d3.svg.axis().scale(y1)
        .orient("right").ticks(10);

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var finData;
    d3.json(file, function (error, dataA) {
        finData = dataA.rows;
    });
    d3.json(line, function (error, dataA) {
        dataA = dataA.rows;
        dataA = dataA.filter(function (d) { return suburbs.includes(d.key) });
        console.log('ag', dataA[0].value, dataA[0].key);
        finData.forEach(function (item) {
            var result = dataA.filter(function (datum) {
                return datum.key === item.key;
            });
            item.tweets = (result[0] !== undefined) ? result[0].value : null;
        });
        console.log(finData);
        x.domain(finData.map(function (d) { return d.key; }));
        y.domain([0, d3.max(finData, function (d) { if (parameter === 'nation') return d.value.international_count; else return d.value; })]);
        y1.domain([0, d3.max(finData, function (d) { return d.tweets; })]).nice();
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-35)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text(yTitle)
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em");

        svg.append("g")
            .attr("class", "y axis1")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisRight)
            .append("text")
            .style("text-anchor", "end")
            .text("Late Night tweets")
            .attr("transform", "rotate(-90)")
            .attr("dy", "-0.8em");

        svg.selectAll(".bar")
            .data(finData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { if (parameter === 'nation') return y(d.value.international_count); else return y(d.value) })
            .attr("height", function (d) { if (parameter === 'nation') return height - y(d.value.international_count); else return height - y(d.value); });


        svg.selectAll(".text")
            .data(finData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (function (d) { return x(d.key) + x.rangeBand() / 2; }))
            .attr("y", function (d) { if (parameter === 'nation') return y(d.value.international_count) + 1; else return y(d.value) + 1; })
            .attr("dy", "-1em")
            .attr("dx", "-1.2em")
            .text(function (d) { if (parameter === 'nation') return formatNum(d.value.international_count); else return formatNum(d.value); })
            .style("font-weight", "bold")
            .style("font-size", "8.5px");

        var valueline = d3.svg.line()
            .x(function (d) { return x(d.key); })
            .y(function (d) { return y1(d.tweets); });

        svg.append("g")
            .selectAll("rect").data(finData).enter().append("g")
            .append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", valueline(finData));

        var bisect = d3.bisector(function (d) { return d.key; }).left
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "#6b486b")
            .attr("stroke", "black")
            .attr('r', 2.5)
            .style("opacity", 0)

        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity", 1)
        }

        function mousemove() {
            // recover coordinate we need
            var xPos = d3.mouse(this)[0];
            var leftEdges = x.range();
            var width = x.rangeBand();
            var j;
            for (j = 0; xPos > (leftEdges[j] + width); j++) { }
            var x0 = x.domain()[j];
            var i = bisect(finData, x0, 1);
            selectedData = finData[i]
            focus
                .attr("cx", x(selectedData.key))
                .attr("cy", y1(selectedData.tweets))
            focusText
                .html(selectedData.key + "\n" + "tweets: " + selectedData.tweets)
                .style("font-weight", "bold")
                .attr("x", x(selectedData.key))
                .attr("y", y1(selectedData.tweets))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }
    });
}

function renderPlots(parameter) {
    var ip;
    const port = 30000;

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

    var formatNum = d3.format(".1f");
    var fileS, idS, yTitleS, tTip;
    if (parameter === 'age') {
        fileS = 'http://' + ip + ':' + port +'/getAurinAgeData';
        idS = '#scatterPlot';
        yTitleS = "Population (Aged 15-40)";
        tTip = "#scatterCard";
    }
    else if (parameter === 'alcohol') {
        fileS = 'http://' + ip + ':' + port +'/getAurinAlcoholData';
        idS = '#alcoholScatterPlot';
        yTitleS = "Average Alcohol Consumption";
        tTip = "#alcoholSCard";
    }
    else if (parameter === 'disease') {
        fileS = 'http://' + ip + ':' + port +'/getAurinDiseaseData';
        idS = '#diseaseScatterPlot';
        yTitleS = "Disease Count";
        tTip = "#diseaseSCard";
    }
    else if (parameter === 'health') {
        fileS = 'http://' + ip + ':' + port +'/getAurinHealthData';
        idS = '#healthScatterPlot';
        yTitleS = "Number of healthy people";
        tTip = "#healthSCard";
    }
    else if (parameter === 'income') {
        fileS = 'http://' + ip + ':' + port +'/getAurinIncomeData';
        idS = '#incomeScatterPlot';
        yTitleS = "Income";
        tTip = "#incomeSCard";
    }
    else if (parameter === 'life') {
        fileS = 'http://' + ip + ':' + port +'/getAurinLifeSatisfactionData';
        idS = '#lifeScatterPlot';
        yTitleS = "Life Satisfaction Measure";
        tTip = "#lifeSCard";
    }
    else if (parameter === 'creative') {
        fileS = 'http://' + ip + ':' + port +'/getAurinCreativityData';
        idS = '#creativeScatterPlot';
        yTitleS = "Number of Creative People";
        tTip = "#creativeSCard";
    }
    else if (parameter === 'nation') {
        fileS = 'http://' + ip + ':' + port +'/getAurinNationalityData';
        idS = '#nationScatterPlot';
        yTitleS = "Number of Foreign People";
        tTip = "#nationSCard";
    }
    var lineS = 'http://'+ ip + ':' + port +'/getLateTweetCountBySuburb';
    //Scatter Plot 
    var marginS = { top: 20, right: 20, bottom: 30, left: 40 },
        widthS = 600 - marginS.left - marginS.right,
        heightS = 350 - marginS.top - marginS.bottom;

    // setup x 
    var xValue = function (d) { return d.tweets; },
        xScale = d3.scale.linear().range([0, widthS]),
        xMap = function (d) { return xScale(xValue(d)); },
        xAxisS = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function (d) { if (parameter === 'nation') return d.value.international_count; else return d.value; },
        yScale = d3.scale.linear().range([heightS, 0]),
        yMap = function (d) { return yScale(yValue(d)); },
        yAxisS = d3.svg.axis().scale(yScale).orient("left");

    // add the graph canvas to the body of the webpage
    var svgS = d3.select(idS).append("svg")
        .attr("width", widthS + marginS.left + marginS.right + 150)
        .attr("height", heightS + marginS.top + marginS.bottom)
        .append("g")
        .attr("transform", "translate(" + marginS.left + "," + marginS.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select(tTip).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var finalData;

    // load data
    d3.json(fileS, function (error, data) {
        finalData = data.rows;
    });

    d3.json(lineS, function (error, data) {
        data = data.rows;
        data = data.filter(function (d) { return suburbs.includes(d.key) });
        finalData.forEach(function (item) {
            var result = data.filter(function (datum) {
                return datum.key === item.key;
            });
            item.tweets = (result[0] !== undefined) ? result[0].value : null;
        });
        xScale.domain([d3.min(finalData, xValue) - 1, d3.max(finalData, xValue) + 1]);
        yScale.domain([d3.min(finalData, yValue) - 1, d3.max(finalData, yValue) + 1]);

        // x-axis
        svgS.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightS + ")")
            .call(xAxisS)
            .append("text")
            .attr("class", "label")
            .attr("x", widthS)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text("Late Night Tweets");

        // y-axis
        svgS.append("g")
            .attr("class", "y axis")
            .call(yAxisS)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text(yTitleS);

        // draw dots
        svgS.selectAll(".dot")
            .data(finalData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "#7b6888")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.key + "<br/> (" + xValue(d)
                    + ", " + formatNum(yValue(d)) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 550) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });

}