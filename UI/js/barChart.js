var selectBox = document.getElementById('barGraphSelect');
$(selectBox).on('change', function(){
    renderChart();
});
function renderChart() {
    d3.select("svg").remove();
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
                  return "<strong>Tweets:</strong> <span style='color:black;'>" + d.num_tweets + "</span>";
                })

            var svg = d3.select("#barGraph").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
            
            svg.call(tip);

            d3.json(selectBox.options[selectBox.selectedIndex].value, function(error, data) {
                
            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return d.num_tweets; })]); 

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
                .attr("x", function(d) { return x(d.name); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.num_tweets); })
                .attr("height", function(d) { return height - y(d.num_tweets);})
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
            });
}
