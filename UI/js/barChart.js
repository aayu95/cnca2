var selectBox = document.getElementById('barGraphSelect');
$(selectBox).on('change', function(){
    renderPie(selectBox.options[selectBox.selectedIndex].value);
});
var suburbs = ["Albert Park", "Melbourne", "Brighton (Vic.)", "Brunswick", "Burwood", "Carlton", "Caulfield - North", "Clayton", "Dandenong", "Docklands", "East Melbourne", "Fitzroy", "Footscray", "Hawthorn", "Kensington (Vic.)", "Laverton", "Malvern East", "Melbourne Airport", "Mooroolbark", "North Melbourne", "Parkville", "Prahran - Windsor", "Richmond (Vic.)", "Skye - Sandhurst", "South Melbourne", "South Yarra - East", "Southbank", "St Kilda", "Yarra Valley"];
function renderChart(parameter) {
    var file;
    if(parameter==='pie')
        file='http://localhost:3000/getAurinAgeData'
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
}

function renderMultiChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

var svg = d3.select('#barGraph').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("sentiment.json", function(error, data) {
data=data.rows;
  var categoriesNames = data.map(function(d) { return d.key; });
  var rateNames = data[0].values.map(function(d) { return d.rate; });

  x0.domain(data.map(function(d) { return d.key; }));
  x1.domain(['positive_count', 'negative_count', 'neutral_count']).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, d => d.value.positive_count > d.value.negative_count ? d.value.positive_count : d.value.negative_count)]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.rate); })
      .style("fill", function(d) { return color(d.rate) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.rate));
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend = svg.selectAll(".legend")
      .data(data[0].values.map(function(d) { return d.rate; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});
}

function renderPie(parameter) {
    var file;
    if(parameter==='pie')
        file='http://localhost:3000/getTweetCountBySuburb'
    var margin = {top: 20, right: 20, bottom: 80, left: 70},
    width = 800 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
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
    .value(function(d) { return d.value; });

var svg = d3.select("#barGraph").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


d3.json(file, function(error, data) {
  if (error) throw error;
  data = data.rows;
  data = data.filter(function(d) {return suburbs.includes(d.key)})
  console.log(pie(data))

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.key); });

    svg
  .selectAll('allPolylines')
  .data(pie(data))
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = labelArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = labelArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(pie(data))
  .enter()
  .append('text')
    .text( function(d) {return d.data.key+': '+d.data.value})
    .attr('transform', function(d) {
        var pos = labelArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
});
}