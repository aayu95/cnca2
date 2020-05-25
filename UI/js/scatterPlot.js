var selectBoxScatter = document.getElementById('scatterPlotSelect');
$(selectBoxScatter).on('change', function(){
    renderLine();
});

function renderPlot() {
  d3.select("svg").remove();
  var marginS = {top: 20, right: 20, bottom: 30, left: 40},
                widthS = 600 - marginS.left - marginS.right,
                heightS = 350 - marginS.top - marginS.bottom;
            
            // setup x 
            var xValue = function(d) { return d.total_pop;}, // data -> value
                xScale = d3.scale.linear().range([0, widthS]), // value -> display
                xMap = function(d) { return xScale(xValue(d));}, // data -> display
                xAxisS = d3.svg.axis().scale(xScale).orient("bottom");
            
            // setup y
            var yValue = function(d) { return d.num_tweets;}, // data -> value
                yScale = d3.scale.linear().range([heightS, 0]), // value -> display
                yMap = function(d) { return yScale(yValue(d));}, // data -> display
                yAxisS = d3.svg.axis().scale(yScale).orient("left");
            
            // setup fill color
            var cValue = function(d) { return d.name;},
                color = d3.scale.category10();
            
            // add the graph canvas to the body of the webpage
            var svgS = d3.select("#scatterPlot").append("svg")
                .attr("width", widthS + marginS.left + marginS.right)
                .attr("height", heightS + marginS.top + marginS.bottom)
              .append("g")
                .attr("transform", "translate(" + marginS.left + "," + marginS.top + ")");
            
            // add the tooltip area to the webpage
            var tooltip = d3.select("#scatterPlot").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            // load data
            d3.json(selectBoxScatter.options[selectBoxScatter.selectedIndex].value, function(error, data) {
            
              //change string (from CSV) into number format
              data.forEach(function(d) {
                d.total_pop = +d.total_pop;
                d.num_tweets = +d.num_tweets;
                //console.log(d);
              });
            
              // don't want dots overlapping axis, so add in buffer to data domain
              xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
              yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
            
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
                  .text("Total Population");
            
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
                  .text("Number of Tweets");
            
              // draw dots
              svgS.selectAll(".dot")
                  .data(data)
                .enter().append("circle")
                  .attr("class", "dot")
                  .attr("r", 3.5)
                  .attr("cx", xMap)
                  .attr("cy", yMap)
                  .style("fill", function(d) { return color(cValue(d));}) 
                  .on("mouseover", function(d) {
                      tooltip.transition()
                           .duration(200)
                           .style("opacity", .9);
                      tooltip.html(d.name + "<br/> (" + xValue(d) 
                        + ", " + yValue(d) + ")")
                           .style("left", (d3.event.pageX + 5) + "px")
                           .style("top", (d3.event.pageY - 28) + "px");
                  })
                  .on("mouseout", function(d) {
                      tooltip.transition()
                           .duration(500)
                           .style("opacity", 0);
                  });
            
              // draw legend
            //   var legend = svgS.selectAll(".legend")
            //       .data(color.domain())
            //     .enter().append("g")
            //       .attr("class", "legend")
            //       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
            
              // draw legend colored rectangles
            //   legend.append("rect")
            //       .attr("x", widthS - 18)
            //       .attr("width", 18)
            //       .attr("heightS", 18)
            //       .style("fill", color);
            
            //   // draw legend text
            //   legend.append("text")
            //       .attr("x", widthS - 24)
            //       .attr("y", 9)
            //       .attr("dy", ".35em")
            //       .style("text-anchor", "end")
            //       .text(function(d) { return d;})
            });
            
}

//Line Chart
function renderLine() {
  d3.select("svg").remove();
  var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 900 - margin.left - margin.right,
	height = 350 - margin.top - margin.bottom;
 
// Set the ranges
var	x = d3.scale.linear().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);
 
// Define the axes
var	xAxis = d3.svg.axis().scale(x)
  .orient("bottom").ticks(24)
  .tickFormat(function(d) {
    var f = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
  return (f[d]);
}).tickValues([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
 
var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);
 
// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.key); })
	.y(function(d) { return y(d.value); });
    
// Adds the svg canvas
var	svg = d3.select("#scatterPlot")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
// Get the data
d3.json("http://localhost:3000/getTimeTrend", function(error, data) {
  data=data.rows;
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.key; }));
	y.domain([0, d3.max(data, function(d) { return d.value; })]);
 
	// Add the valueline path.
	svg.append("path")	
		.attr("class", "line")
		.attr("d", valueline(data));
 
	// Add the X Axis
	svg.append("g")		
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
 
	// Add the Y Axis
	svg.append("g")		
		.attr("class", "y axis")
    .call(yAxis);
    
    var bisect = d3.bisector(function(d) { return d.key; }).left
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
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focus.style("opacity", 1)
    focusText.style("opacity",1)
  }

  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);
    selectedData = data[i]
    focus
      .attr("cx", x(selectedData.key))
      .attr("cy", y(selectedData.value))
    focusText
      .html("\nTime:" + parseDate(selectedData.key) + "hrs \n" + "Tweets: " + selectedData.value)
      .attr("x", x(selectedData.key))
      .attr("y", y(selectedData.value))
    }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }

});
}
