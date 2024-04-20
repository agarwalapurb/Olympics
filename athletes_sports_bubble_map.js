// Set default season label
document.getElementById('season-labelb').innerText = 'Summer';

// Add event listener to update season label
const seasonToggleb = document.getElementById('season-toggleb');
const seasonLabelb = document.getElementById('season-labelb');

seasonToggleb.addEventListener('change', function() {
    if (this.checked) {
        seasonLabelb.innerText = 'Winter';
    } else {
        seasonLabelb.innerText = 'Summer';
    }
});


// Define sportDropdown variable outside the d3.csv().then() function
var sportDropdown = d3.select("#sport");

// Load data and create bubble map based on user selection
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

 // Function to populate sports dropdown
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
        return true; // Return true for other demographics (no filtering)
      }
    });
  }

// Function to update xScale domain dynamically based on the data range
function updateXScaleDomain(selectedDemographic, medalCounts) {
	if (selectedDemographic === "Sex") {
	  return ["M", "F"];
	} else {
	  var minDomain = d3.min(medalCounts, (d) => d.key);
	  var maxDomain = d3.max(medalCounts, (d) => d.key) + getGroupSize(selectedDemographic);
	  var padding = 0.1 * (maxDomain - minDomain); // Adjust padding as needed
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
	  xScale = d3.scaleBand()
		.domain(["M", "F"])
		.range([0, innerWidth])
		.padding(0.1);
	  xAxis = d3.axisBottom(xScale);
	} else {
	  xScale = d3.scaleLinear()
		.domain(xDomain)
		.range([0, innerWidth]);
	  xAxis = d3.axisBottom(xScale).tickFormat(function (d) {
		// Calculate the true range for the demographic
		var trueRange =
		  d * getGroupSize(selectedDemographic) +
		  "-" +
		  (d + 1) * getGroupSize(selectedDemographic);
		return trueRange;
	  });
	}
  
	var yScale = d3
	  .scaleLinear()
	  .domain([0, d3.max(medalCounts, (d) => d.value)])
	  .range([innerHeight, 0]);
  
	var radiusScale = d3
	  .scaleSqrt()
	  .domain([0, d3.max(medalCounts, (d) => d.value)])
	  .range([2, 20]);
  
	// Create axes
	var yAxis = d3.axisLeft(yScale);
  
	svg
	  .append("g")
	  .attr("class", "x-axis")
	  .attr("transform", "translate(0," + innerHeight + ")")
	  .call(xAxis);
  
	svg.append("g").attr("class", "y-axis").call(yAxis);
  
	// Create bubbles
	svg
	  .selectAll("circle")
	  .data(medalCounts)
	  .enter()
	  .append("circle")
	  .attr("cx", (d) => {
		if (selectedDemographic === "Sex") {
		  // Assign x-coordinates for "M" and "F"
		  return xScale(d.key) + xScale.bandwidth() / 2;
		} else {
		  return xScale(d.key);
		}
	  })
	  .attr("cy", (d) => yScale(d.value))
	  .attr("r", (d) => radiusScale(d.value))
	  .style("fill", "steelblue");
  
	// Add labels
	svg
	  .append("text")
	  .attr("class", "x-axis-label")
	  .attr("x", innerWidth / 2)
	  .attr("y", innerHeight + margin.top + 10)
	  .style("text-anchor", "middle")
	  .text(selectedDemographic);
  
	svg
	  .append("text")
	  .attr("class", "y-axis-label")
	  .attr("transform", "rotate(-90)")
	  .attr("x", -innerHeight / 2)
	  .attr("y", -margin.left + 10)
	  .style("text-anchor", "middle")
	  .text("Number of Medals");
  }
  
  

  // Call updateBubbleMap initially
  updateBubbleMap();

  // Call updateBubbleMap whenever dropdown values change
  sportDropdown.on("change", updateBubbleMap);
  d3.select("#demographicb").on("change", updateBubbleMap);

  // Helper function to determine group size based on demographic
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
