var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley", "Collingwood"];
function renderPie() {
    var file = 'http://localhost:3000/getTweetCountBySuburb'
    var margin = { top: 20, right: 20, bottom: 80, left: 70 },
        width = 700 - margin.left - margin.right + 20,
        height = 450 - margin.top - margin.bottom ;
    radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.5)
        .innerRadius(radius * 0.8);

    var labelArc = d3.svg.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) { return d.value; });

    var svg = d3.select("#pieChart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    d3.json(file, function (error, data) {
        if (error) throw error;
        data = data.rows;
        data = data.filter(function (d) { return suburbs.includes(d.key) })

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

            var tooltip = d3.select("#pieCard")
		        .append('div')
		        .attr('class', 'tooltip');

		tooltip.append('div')
		.attr('class', 'label');

		tooltip.append('div')
		.attr('class', 'count');

        var path = g.append("path")
            .attr("d", arc)
            .style("fill", function (d) { return color(d.data.key); });

        path.on('mouseover', function(d){
            tooltip.select('.label').html(d.data.key).style('color', 'black');
            tooltip.select('.count').html(d.data.value);
            tooltip.style('background-color', 'white');
            tooltip.style('border', 'solid 1px black');
            tooltip.style('border-radius', '1em');
            tooltip.style('height', '3.5em');
            tooltip.style('width', '9em');
            tooltip.style('text-align', 'center');
            tooltip.style('padding', '4px');
            tooltip.style('display', 'block');
			tooltip.style('opacity',0.9);
        })

        path.on('mousemove', function(d) {
			tooltip.style('top', (d3.event.pageY + 5) + 'px')
			.style('left', (d3.event.pageX - 25) + 'px');
		});

		path.on('mouseout', function() {
			tooltip.style('display', 'none');
			tooltip.style('opacity',0);
		});

        // svg
        //     .selectAll('allPolylines')
        //     .data(pie(data))
        //     .enter()
        //     .append('polyline')
        //     .attr("stroke", "black")
        //     .style("fill", "none")
        //     .attr("stroke-width", 1)
        //     .attr('points', function (d) {
        //         var posA = arc.centroid(d) // line insertion in the slice
        //         var posB = labelArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        //         var posC = labelArc.centroid(d); // Label position = almost the same as posB
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        //         posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        //         return [posA, posB, posC]
        //     })

        // // Add the polylines between chart and labels:
        // svg
        //     .selectAll('allLabels')
        //     .data(pie(data))
        //     .enter()
        //     .append('text')
        //     .text(function (d) { return d.data.key + ': ' + d.data.value })
        //     .attr('transform', function (d) {
        //         var pos = labelArc.centroid(d);
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        //         pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        //         return 'translate(' + pos + ')';
        //     })
        //     .style('text-anchor', function (d) {
        //         var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        //         return (midangle < Math.PI ? 'start' : 'end')
        //     })
    });
}

function renderLine() {
    //d3.select("svg").remove();
    var marginL = { top: 30, right: 20, bottom: 30, left: 60 },
        widthL = 900 - marginL.left - marginL.right,
        heightL = 350 - marginL.top - marginL.bottom;

    // Set the ranges
    var xL = d3.scale.linear().range([0, widthL]);
    var yL = d3.scale.linear().range([heightL, 0]);

    // Define the axes
    var xAxisL = d3.svg.axis().scale(xL)
        .orient("bottom").ticks(24)
        .tickFormat(function (d) {
            var f = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
            return (f[d]);
        }).tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);

    var yAxisL = d3.svg.axis().scale(yL)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) { return xL(d.key); })
        .y(function (d) { return yL(d.value); });

    // Adds the svg canvas
    var svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", widthL + marginL.left + marginL.right+140)
        .attr("height", heightL + marginL.top + marginL.bottom)
        .append("g")
        .attr("transform", "translate(" + marginL.left + "," + marginL.top + ")");

    // Get the data
    d3.json("http://localhost:3000/getTimeTrend", function (error, data) {
        data = data.rows;
        // Scale the range of the data
        xL.domain(d3.extent(data, function (d) { return d.key; }));
        yL.domain([0, d3.max(data, function (d) { return d.value; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightL + ")")
            .call(xAxisL);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisL);

        var bisect = d3.bisector(function (d) { return d.key; }).left
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "steelblue")
            .attr("stroke", "black")
            .attr('r', 2.5)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
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
            .attr('width', widthL)
            .attr('height', heightL)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);


        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity", 1)
        }

        function mousemove() {
            // recover coordinate we need
            var x0 = xL.invert(d3.mouse(this)[0]);
            var i = bisect(data, x0, 1);
            selectedData = data[i]
            focus
                .attr("cx", xL(selectedData.key))
                .attr("cy", yL(selectedData.value))
            focusText
                .html("\nTime:" + selectedData.key + "hrs \n" + "Tweets: " + selectedData.value)
                .attr("x", xL(selectedData.key))
                .attr("y", yL(selectedData.value))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }

    });
}
