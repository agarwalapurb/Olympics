// Set default season label
document.getElementById("season-labelb").innerText = "Summer";

// Add event listener to update season label
const seasonToggleb = document.getElementById("season-toggleb");
const seasonLabelb = document.getElementById("season-labelb");

seasonToggleb.addEventListener("change", function () {
  if (this.checked) {
    seasonLabelb.innerText = "Winter";
  } else {
    seasonLabelb.innerText = "Summer";
  }
});

// Define sportDropdown variable
var sportDropdown = d3.select("#sport");

// Load data and create bubble map
d3.csv("archive/athlete_events.csv").then(function (data) {
  // Function to filter sports based on season
  function filterSportsBySeason(season) {
    return data.filter((d) => {
      if (season === "Summer") {
        return d.Season === "Summer";
      } else {
        return d.Season === "Winter";
      }
    });
  }

  // Populate sports dropdown
  function populateSportsDropdown(season) {
    var sportsData = filterSportsBySeason(season);
    var sports = Array.from(new Set(sportsData.map((d) => d.Sport)));

    // Sort sports alphabetically
    sports.sort();

    // Clear previous options
    sportDropdown.selectAll("option").remove();

    // Populate dropdown with sorted sports
    sportDropdown
      .selectAll("option")
      .data(sports)
      .enter()
      .append("option")
      .text((d) => d)
      .attr("value", (d) => d);
  }

  // Populate sports dropdown initially
  populateSportsDropdown("Summer");

  // Add event listener to season toggle
  d3.select("#season-toggleb").on("change", function () {
    var season = this.checked ? "Winter" : "Summer";
    populateSportsDropdown(season);
    updateBubbleMap(); // Update bubble map when season changes
  });

  // Function to filter out NaN values for a particular demographic
  function filterNaNValues(data, demographic) {
    return data.filter((d) => {
      if (
        demographic === "Age" ||
        demographic === "Height" ||
        demographic === "Weight"
      ) {
        return !isNaN(parseFloat(d[demographic]));
      } else if (demographic === "Sex") {
        return d[demographic] !== ""; // Filter out empty strings for 'Sex' demographic
      } else {
        return true;
      }
    });
  }

  // Function to update xScale domain dynamically based on the data range
  function updateXScaleDomain(selectedDemographic, medalCounts) {
    if (selectedDemographic === "Sex") {
      return ["M", "F"];
    } else {
      var minDomain = d3.min(medalCounts, (d) => d.key);
      var maxDomain =
        d3.max(medalCounts, (d) => d.key) + getGroupSize(selectedDemographic);
      var padding = 0.1 * (maxDomain - minDomain);
      return [minDomain - padding, maxDomain + padding];
    }
  }

  // Function to update bubble map
  function updateBubbleMap() {
    var selectedSport = sportDropdown.property("value");
    var selectedDemographic = d3.select("#demographicb").property("value");
    var filteredData = data.filter((d) => d.Sport === selectedSport);

    // Filter out NaN values for the selected demographic
    filteredData = filterNaNValues(filteredData, selectedDemographic);

    // Filter data to include only athletes who have won a medal
    filteredData = filteredData.filter((d) => d.Medal !== "NA");

    // Clear previous chart
    d3.select("#chartb").selectAll("*").remove();

    // Group data by selected demographic
    var groupedData;
    if (selectedDemographic === "Sex") {
      // Group by "M" and "F" values
      groupedData = d3.group(filteredData, (d) => d[selectedDemographic]);
    } else {
      groupedData = d3.group(filteredData, (d) =>
        Math.floor(d[selectedDemographic] / getGroupSize(selectedDemographic))
      );
    }

    // Calculate total medals won in each group
    var medalCounts = Array.from(groupedData, ([key, value]) => ({
      key: key,
      value: value.length,
    }));

    // Update xScale domain
    var xDomain = updateXScaleDomain(selectedDemographic, medalCounts);

    // Set up SVG dimensions
    var width = 600;
    var height = 400;
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    var svg = d3
      .select("#chartb")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales
    var xScale, xAxis;
    if (selectedDemographic === "Sex") {
      xScale = d3
        .scaleBand()
        .domain(["M", "F"])
        .range([0, innerWidth])
        .padding(0.1);
      xAxis = d3.axisBottom(xScale);
    } else {
      xScale = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
      xAxis = d3.axisBottom(xScale).tickFormat(function (d) {
        // Calculate the true range for the demographic
        var trueRange =
          d * getGroupSize(selectedDemographic) +
          "-" +
          (d + 1) * getGroupSize(selectedDemographic);
        return trueRange;
      });
    }

    // Define radius scale
    var radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(medalCounts, (d) => d.value)])
      .range([2, 20]);

    // Define color scale
    var colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(medalCounts, (d) => d.value)]);


    // Create bubbles with collision detection and resolution
    var circles = svg
      .selectAll("circle")
      .data(medalCounts)
      .enter()
      .append("circle")
      .attr("r", (d) => 3 * radiusScale(d.value))
      .style("fill", (d) => colorScale(d.value))
      .call(positionBubbles);

      function positionBubbles(selection) {
        selection.each(function (d) {
          var bubble = d3.select(this);
      
          // Position the bubble
          var x, y;
          var safe = false;
          var count = 0;
          while (!safe && count < 1000) {
            count++;
            x = (Math.random() * 3 * innerWidth) / 4 + innerWidth / 8;
            y = (Math.random() * 3 * innerHeight) / 4 + innerHeight / 8;
            safe = true;
      
            // Check for collisions with existing bubbles
            svg.selectAll("circle").each(function () {
              var dx = parseFloat(d3.select(this).attr("cx")) - x;
              var dy = parseFloat(d3.select(this).attr("cy")) - y;
              var distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 3 * radiusScale(d.value) + parseFloat(d3.select(this).attr("r")) + 1) {
                safe = false;
              }
            });
          }
      
          // Set the position of the bubble
          bubble.attr("cx", x).attr("cy", y);
      
          // Calculate the brightness of the bubble's color
          var colorBrightness = d3.lab(colorScale(d.value)).l;

          // Skip writing text for smaller bubbles
          if (3 * radiusScale(d.value) < 17) {
            return;
          }
      
          // Add text representing range/category
          svg
            .append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(
              selectedDemographic === "Sex"
                ? d.key
                : d.key * getGroupSize(selectedDemographic) +
                    "-" +
                    (d.key + 1) * getGroupSize(selectedDemographic)
            )
            .attr("font-size", "10px")
            .attr("fill", colorBrightness > 70 ? "black" : "white")
            .attr("font-family", "Arial, sans-serif");
        });
      }

    // Create a div for the tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Show tooltip on hover
    circles.on("mouseover", function (event, d) {
      var tooltipContent =
        selectedDemographic === "Sex"
          ? selectedDemographic +
            ": " +
            d.key +
            "<br>Number of Medals: " +
            d.value
          : selectedDemographic +
            ": " +
            d.key * getGroupSize(selectedDemographic) +
            "-" +
            (d.key + 1) * getGroupSize(selectedDemographic) +
            "<br>Number of Medals: " +
            d.value;

      // Update tooltip content and position
      tooltip
        .html(tooltipContent)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px")
        .transition()
        .duration(0)
        .style("opacity", 0.9);
    });

    // Hide tooltip on mouseout
    circles.on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

    // Function to create color legend
    function createColorLegend(colorScale, svg) {
      var legendWidth = 200;
      var legendHeight = 20;
      var legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(320, -25)");

      var defs = legend.append("defs");

      var linearGradient = defs
        .append("linearGradient")
        .attr("id", "linear-gradient");

      // Define the gradient stops
      linearGradient
        .selectAll("stop")
        .data(
          colorScale.ticks().map((t, i, n) => ({
            offset: `${(100 * i) / n.length}%`,
            color: colorScale(t),
          }))
        )
        .enter()
        .append("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

      // Append the rectangle to the legend
      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)");

      // Define legend scale
      var legendScale = d3
        .scaleLinear()
        .range([0, legendWidth])
        .domain(colorScale.domain());

      // Create axis
      var legendAxis = d3
        .axisBottom(legendScale)
        .tickValues(colorScale.domain())
        .tickFormat(d3.format("d"));

      // Append the legend axis
      legend
        .append("g")
        .attr("class", "legend-axis")
        .attr("transform", "translate(0," + legendHeight + ")")
        .call(legendAxis);

      // Append label below the legend
      legend
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendWidth / 2)
        .attr("y", legendHeight + 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Medal Count");
    }

    // Call createColorLegend
    createColorLegend(colorScale, svg);
  }

  // Call updateBubbleMap initially
  updateBubbleMap();

  // Call updateBubbleMap whenever dropdown values change
  sportDropdown.on("change", updateBubbleMap);
  d3.select("#demographicb").on("change", updateBubbleMap);

  // Function to determine group size based on demographic
  function getGroupSize(demographic) {
    if (demographic === "Age" || demographic === "Height") {
      return 5;
    } else if (demographic === "Weight") {
      return 10;
    } else {
      return 1;
    }
  }
});

$("#demographicb").change(function () {
  var selectedDemographic = $(this).val();
  $("#selected-demographic").text(selectedDemographic);
});

$("#sport").change(function () {
  var selectedSport = $(this).val();
  $("#selected-sport").text(selectedSport);
});

$("#season-toggleb").change(function () {
  var selectedSeason = $(this).prop("checked") ? "Winter" : "Summer";
  $("#season-labelb").text(selectedSeason);

  // Update the sport displayed based on the selected season
  if (selectedSeason === "Winter") {
    $("#selected-sport").text("Alpine Skiing");
  } else {
    $("#selected-sport").text("Aeronautics");
  }
});
