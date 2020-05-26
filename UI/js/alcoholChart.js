var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley", "Collingwood"];
$(document).ready(function () {
    renderPlotsA();
    var file = 'http://localhost:3000/getAurinAlcoholData';
    var line = 'http://localhost:3000/getLateTweetCountBySuburb';
    var marginA = { top: 30, right: 20, bottom: 80, left: 70 },
        widthA = 700 - marginA.left - marginA.right,
        heightA = 350 - marginA.top - marginA.bottom;

    var formatNum = d3.format(".1f");

    var xA = d3.scale.ordinal().rangeRoundBands([0, widthA], .05);

    var yA = d3.scale.linear().range([heightA, 0]);
    var yA1 = d3.scale.linear().range([heightA, 0]).nice();

    var xAxisA = d3.svg.axis()
        .scale(xA)
        .orient("bottom")
        .ticks(10);

    var yAxisA = d3.svg.axis()
        .scale(yA)
        .orient("left")
        .ticks(10);

    var yAxisRightA = d3.svg.axis().scale(yA1)
        .orient("right").ticks(10);

    var svg = d3.select("#alcoholBarGraph").append("svg")
        .attr("width", widthA + marginA.left + marginA.right + 100)
        .attr("height", heightA + marginA.top + marginA.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginA.left + "," + marginA.top + ")");

    var finDataA;
    d3.json(file, function (error, data) {
        finDataA = data.rows;
    });
    d3.json(line, function (error, data) {
        data = data.rows;
        data = data.filter(function (d) { return suburbs.includes(d.key) });
        finDataA.forEach(function (item) {
            var result = data.filter(function (datum) {
                return datum.key === item.key;
            });
            item.tweets = (result[0] !== undefined) ? result[0].value : null;
        });
        console.log(finDataA);
        xA.domain(finDataA.map(function (d) { return d.key; }));
        yA.domain([0, d3.max(finDataA, function (d) { return d.value; })]);
        yA1.domain([0, d3.max(finDataA, function (d) { return d.tweets; })]).nice();
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightA + ")")
            .call(xAxisA)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-35)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisA)
            .append("text")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text("Average Alcohol consumption") //here
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em");

        svg.append("g")
            .attr("class", "y axis1")
            .attr("transform", "translate(" + widthA + " ,0)")
            .call(yAxisRightA)
            .append("text")
            .style("text-anchor", "end")
            .text("Late Night tweets")
            .attr("transform", "rotate(-90)")
            .attr("dy", "-0.8em");

        svg.selectAll(".bar")
            .data(finDataA)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xA(d.key); })
            .attr("width", xA.rangeBand())
            .attr("y", function (d) { return yA(d.value); })
            .attr("height", function (d) { return heightA - yA(d.value); });


        svg.selectAll(".text")  		
        .data(finDataA)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d) { return xA(d.key) + xA.rangeBand() / 2 ; }  ))
        .attr("y", function(d) { return yA(d.value) + 1; })
        .attr("dy", "-1em")
        .attr("dx", "-1.2em")
        .text(function(d) { return formatNum(d.value); })
        .style("font-weight", "bold")
        .style("font-size", "8.5px");   	  

        var valueline = d3.svg.line()
            .x(function (d) { return xA(d.key); })
            .y(function (d) { return yA1(d.tweets); });

        svg.append("g")
            .selectAll("rect").data(finDataA).enter().append("g")
            .append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", valueline(finDataA));

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
            .attr('width', widthA)
            .attr('height', heightA)
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
            var leftEdges = xA.range();
            var widthA = xA.rangeBand();
            var j;
            for (j = 0; xPos > (leftEdges[j] + widthA); j++) { }
            var x0 = xA.domain()[j];
            var i = bisect(finDataA, x0, 1);
            selectedData = finDataA[i]
            focus
                .attr("cx", xA(selectedData.key))
                .attr("cy", yA1(selectedData.tweets))
                focusText
                .html(selectedData.key + "\n" + "tweets: " + selectedData.tweets)
                .style("font-weight", "bold")
                .attr("x", xA(selectedData.key))
                .attr("y", yA1(selectedData.tweets))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }
    });
});

function renderPlotsA() {
    console.log('in');
    var formatNum = d3.format(".1f");
    //Scatter Plot 
    var marginSA = { top: 20, right: 20, bottom: 30, left: 40 },
        widthSA = 600 - marginSA.left - marginSA.right,
        heightSA = 350 - marginSA.top - marginSA.bottom;

    // setup x 
    var xValueA = function (d) { return d.tweets; }, // data -> value
        xScaleA = d3.scale.linear().range([0, widthSA]), // value -> display
        xMapA = function (d) { return xScaleA(xValueA(d)); }, // data -> display
        xAxisSA = d3.svg.axis().scale(xScaleA).orient("bottom");

    // setup y
    var yValueA = function (d) { return d.value; }, // data -> value
        yScaleA = d3.scale.linear().range([heightSA, 0]), // value -> display
        yMapA = function (d) { return yScaleA(yValueA(d)); }, // data -> display
        yAxisSA = d3.svg.axis().scale(yScaleA).orient("left");

    // add the graph canvas to the body of the webpage
    var svgS = d3.select("#alcoholScatterPlot").append("svg")
        .attr("width", widthSA + marginSA.left + marginSA.right + 150)
        .attr("height", heightSA + marginSA.top + marginSA.bottom)
        .append("g")
        .attr("transform", "translate(" + marginSA.left + "," + marginSA.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#alcoholSCard").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var finalDataA;

    // load data
    d3.json('http://localhost:3000/getAurinAlcoholData', function (error, data) {
        finalDataA = data.rows;
    });

    d3.json('http://localhost:3000/getLateTweetCountBySuburb', function (error, data) {
        data = data.rows;
        data = data.filter(function (d) { return suburbs.includes(d.key) });
        finalDataA.forEach(function (item) {
            var result = data.filter(function (datum) {
                return datum.key === item.key;
            });
            item.tweets = (result[0] !== undefined) ? result[0].value : null;
        });
        xScaleA.domain([d3.min(finalDataA, xValueA) - 1, d3.max(finalDataA, xValueA) + 1]);
        yScaleA.domain([d3.min(finalDataA, yValueA) - 1, d3.max(finalDataA, yValueA) + 1]);

        // x-axis
        svgS.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightSA + ")")
            .call(xAxisSA)
            .append("text")
            .attr("class", "label")
            .attr("x", widthSA)
            .attr("y", -6)
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text("Late Night Tweets");

        // y-axis
        svgS.append("g")
            .attr("class", "y axis")
            .call(yAxisSA)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text("Average Alcohol Consumption");

        // draw dots
        svgS.selectAll(".dot")
            .data(finalDataA)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMapA)
            .attr("cy", yMapA)
            .style("fill", "#7b6888")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.key + "<br/> (" + xValueA(d)
                    + ", " + formatNum(yValueA(d)) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 500) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });

}