var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley"];
$(document).ready(function(){
    renderPlots();
    var file;
    file='http://localhost:30000/getAurinAgeData'
    //d3.select("svg").remove();
    var margin = {top: 20, right: 20, bottom: 80, left: 70},
            width = 600 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(10);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    console.log('hi');
                  return "<strong>Count:</strong> <span style='color:black;'>" + d.value + "</span>";
                });

            var svg = d3.select("#barGraph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
            
            svg.call(tip);

            d3.json(file, function(error, data) {
                data = data.rows;
                data = data.filter(function(d) {return suburbs.includes(d.key)});
                x.domain(data.map(function(d) { console.log(d); return d.key; }));
                y.domain([0, d3.max(data, function(d) { return d.value; })]); 

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-35)"); //rotates the axis label

                    svg.append("text")   
                    .attr("class", "x_axis")          
                    .attr("transform",
                            "translate(" + (width/2) + " ," + 
                                        (height + margin.top + 45) + ")")
                    .style("text-anchor", "middle")
                    .text("Suburb");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em");

                    svg.append("text")
                    .attr("class", "y_axis")         
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 10)
                    .attr("x",0 - (height/2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Number of Tweets");  

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.key); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return height - y(d.value);})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                });
    
});


function renderPlots() {
    //Scatter Plot 
    console.log("hhhhhh");
    var marginS = {top: 20, right: 20, bottom: 30, left: 40},
                    widthS = 600 - marginS.left - marginS.right,
                    heightS = 350 - marginS.top - marginS.bottom;
                
                // setup x 
                var xValue = function(d) { console.log('hi11'); return d.total_pop;}, // data -> value
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
                d3.json('dummy_twitter1.json', function(error, data) {
                data=data.rows;
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
                    });
    
    }

function renderLine() {
    d3.select("svg").remove();
    var	marginL = {top: 30, right: 20, bottom: 30, left: 50},
      widthL = 900 - marginL.left - marginL.right,
      heightL = 350 - marginL.top - marginL.bottom;
   
  // Set the ranges
  var	xL = d3.scale.linear().range([0, widthL]);
  var	yL = d3.scale.linear().range([height, 0]);
   
  // Define the axes
  var	xAxisL = d3.svg.axis().scale(xL)
    .orient("bottom").ticks(24)
    .tickFormat(function(d) {
      var f = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
    return (f[d]);
  }).tickValues([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
   
  var	yAxisL = d3.svg.axis().scale(yL)
      .orient("left").ticks(5);
   
  // Define the line
  var	valueline = d3.svg.line()
      .x(function(d) { return x(d.key); })
      .y(function(d) { return y(d.value); });
      
  // Adds the svg canvas
  var	svg = d3.select("#scatterPlot")
      .append("svg")
          .attr("width", widthL + marginL.left + marginL.right)
          .attr("height", heightL + marginL.top + marginL.bottom)
      .append("g")
          .attr("transform", "translate(" + marginL.left + "," + marginL.top + ")");
   
  // Get the data
  d3.json("http://localhost:30000/getTimeTrend", function(error, data) {
    data=data.rows;
      // Scale the range of the data
      xL.domain(d3.extent(data, function(d) { return d.key; }));
      yL.domain([0, d3.max(data, function(d) { return d.value; })]);
   
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
      .attr('width', widthL)
      .attr('height', heightL)
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
      var x0 = xL.invert(d3.mouse(this)[0]);
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
