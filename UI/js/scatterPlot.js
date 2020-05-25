var selectBoxScatter = document.getElementById('scatterPlotSelect');
$(selectBoxScatter).on('change', function(){
    renderPlot();
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
