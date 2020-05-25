var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley", "Collingwood"];
$(document).ready(function () {
    renderPlots();
    var file = 'http://localhost:3000/getAurinAgeData';
    var line = 'http://localhost:3000/getLateTweetCountBySuburb';
    var margin = { top: 30, right: 20, bottom: 80, left: 70 },
        width = 700 - margin.left - margin.right,
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

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Count:</strong> <span style='color:black;'>" + d.value + "</span>";
        });

    var svg = d3.select("#barGraph").append("svg")
        .attr("width", width + margin.left + margin.right + 20)
        .attr("height", height + margin.top + margin.bottom + 60)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);
    var finData;
    d3.json(file, function (error, data) {
        finData = data.rows;
    });
    d3.json(line, function (error, data) {
        data = data.rows;
        data = data.filter(function (d) { return suburbs.includes(d.key) });
        finData.forEach(function (item) {
            var result = data.filter(function (datum) {
                return datum.key === item.key;
            });
            item.tweets = (result[0] !== undefined) ? result[0].value : null;
        });
        console.log(finData);
        x.domain(finData.map(function (d) { return d.key; }));
        y.domain([0, d3.max(finData, function (d) { return d.value; })]);
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
            .attr("transform", "rotate(-90)")
            .attr("dy", ".71em");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisRight);

        svg.selectAll(".bar")
            .data(finData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

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
            .style("fill", "steelblue")
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
            var i = bisect(data, x0, 1);
            selectedData = data[i]
            focus
                .attr("cx", x(selectedData.key))
                .attr("cy", y(selectedData.value))
            focusText
                .html(selectedData.key + "\n" + "Tweets: " + selectedData.value)
                .attr("x", x(selectedData.key))
                .attr("y", y(selectedData.value))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }


    });
});

function renderPlots() {
    //Scatter Plot 
    var marginS = { top: 20, right: 20, bottom: 30, left: 40 },
        widthS = 600 - marginS.left - marginS.right,
        heightS = 350 - marginS.top - marginS.bottom;

    // setup x 
    var xValue = function (d) { return d.tweets; }, // data -> value
        xScale = d3.scale.linear().range([0, widthS]), // value -> display
        xMap = function (d) { return xScale(xValue(d)); }, // data -> display
        xAxisS = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function (d) { return d.value; }, // data -> value
        yScale = d3.scale.linear().range([heightS, 0]), // value -> display
        yMap = function (d) { return yScale(yValue(d)); }, // data -> display
        yAxisS = d3.svg.axis().scale(yScale).orient("left");

    // add the graph canvas to the body of the webpage
    var svgS = d3.select("#scatterPlot").append("svg")
        .attr("width", widthS + marginS.left + marginS.right)
        .attr("height", heightS + marginS.top + marginS.bottom)
        .append("g")
        .attr("transform", "translate(" + marginS.left + "," + marginS.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("#scatterCard").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var finalData;

    // load data
    d3.json('http://localhost:3000/getAurinAgeData', function (error, data) {
        finalData = data.rows;
    });

    d3.json('http://localhost:3000/getLateTweetCountBySuburb', function (error, data) {
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
            .text("Population (Aged 15 - 40)");

        // draw dots
        svgS.selectAll(".dot")
            .data(finalData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "steelblue")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.key + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
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