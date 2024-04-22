// Set up SVG dimensions and margins
var create_bubble = function(){
var margin = { top: 50, right: 20, bottom: 95, left: 150 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// Append SVG to the body
var svg = d3.select("body").append("svg")
    .attr("id", "svg-container")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define scales for x, y, and bubble size
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]).padding(0.1);
var bubbleSize = d3.scaleLinear().range([5, 30]);

// Add x-axis
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

// Add y-axis
var yAxis = svg.append("g");

// Function for drawing the tooltip
function drawTooltip() {
    // Tooltip div
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip2")
        .style("display", "none");
}

drawTooltip();

// Function for drawing the selected progression
function drawProgression(selectedProgression, selectedGender) {
    // Load data from CSV file
    d3.csv("archive/"+"Record" + (selectedGender === "male" ? "M" : "F") + "_" + selectedProgression + ".csv").then(function(data) {
        // Convert time/height/distance and holding period to numbers
        data.forEach(function(d) {
            if (selectedProgression === "100m") {
                d.Time = +d.Time;
            } else if (selectedProgression === "highJump") {
                d.Height = +d.Height;
            } else if (selectedProgression === "longJump") {
                d.Distance = +d.Distance;
            }
            d.HoldingPeriod = +d.HoldingPeriod;
        });

        // Update domains
        var dataKey;
        if (selectedProgression === "100m") {
            dataKey = "Time";
        } else if (selectedProgression === "highJump") {
            dataKey = "Height";
        } else if (selectedProgression === "longJump") {
            dataKey = "Distance";
        }
        x.domain([d3.min(data, function(d) { return d[dataKey]; }) - 0.1, d3.max(data, function(d) { return d[dataKey]; }) + 0.1]);
        y.domain(data.map(function(d) { return d.Athlete; }));
        bubbleSize.domain([0, d3.max(data, function(d) { return d.HoldingPeriod; })]);

        // Remove previous elements
        svg.selectAll(".circle").remove();
        svg.selectAll(".grid-line").remove();

        // Add horizontal grid lines
        svg.selectAll(".grid-line")
            .data(data)
            .enter().append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("y1", function(d) { return y(d.Athlete) + y.bandwidth() / 2; })
            .attr("x2", width)
            .attr("y2", function(d) { return y(d.Athlete) + y.bandwidth() / 2; })
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2,2");

        // Create bubbles
        svg.selectAll(".circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) { return x(d[dataKey]); })
            .attr("cy", function(d) { return y(d.Athlete) + y.bandwidth() / 2; })
            .attr("r", function(d) { return bubbleSize(d.HoldingPeriod); })
            .style("fill", "#c994c7")
            .style("opacity",0.7)
            .on("mouseover", function(event, d) {
                // Show tooltip
                d3.select(".tooltip2")
                    .style("display", "block")
                    .html("<strong>Athlete:</strong> " + d.Athlete + "<br>" +
                          "<strong>Date:</strong> " + d.Date + "<br>" +
                          "<strong>" + (selectedProgression === "100m" ? "Time" : (selectedProgression === "highJump" ? "Height" : "Distance")) + ":</strong> " +
                          (selectedProgression === "100m" ? d.Time + " seconds" : (selectedProgression === "highJump" ? d.Height + " meters" : d.Distance + " meters")) + "<br>" +
                          "<strong>Country:</strong> " + d.Country + "<br>" +
                          "<strong>Holding Period:</strong> " + d.HoldingPeriod + " years")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function() {
                // Hide tooltip
                d3.select(".tooltip2").style("display", "none");
            });

        // Update x-axis label
        svg.selectAll(".x-axis-label").remove();
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
            .style("text-anchor", "middle")
            .text(selectedProgression === "100m" ? "Time (seconds)" : (selectedProgression === "highJump" ? "Height (meters)" : "Distance (meters)"));

        // Update y-axis label
        svg.selectAll(".y-axis-label").remove();
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Athlete");

        // Update chart title
        svg.selectAll(".chart-title").remove();
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("World Record Progression - " + selectedProgression + " (" + (selectedGender === "male" ? "Male" : "Female") + ")");

        // Update x-axis and y-axis
        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y).tickSizeOuter(0));
    });
}

// Function to load the selected progression and gender
function loadProgression() {
    var selectedProgression = document.getElementById("progression-select").value;
    var selectedGender = document.getElementById("gender-select").value;
    drawProgression(selectedProgression, selectedGender);
}

// Listen for changes in the dropdowns
document.getElementById("progression-select").addEventListener("change", loadProgression);
document.getElementById("gender-select").addEventListener("change", loadProgression);

// Initial loading of progression
loadProgression();
}
create_bubble();