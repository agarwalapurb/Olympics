// Set default season label
document.getElementById("season-label").innerText = "Summer";

// Add event listener to update season label
const seasonToggle = document.getElementById("season-toggle");
const seasonLabel = document.getElementById("season-label");

seasonToggle.addEventListener("change", function () {
  if (this.checked) {
    seasonLabel.innerText = "Winter";
  } else {
    seasonLabel.innerText = "Summer";
  }
});

// Load data from CSV file
d3.csv("archive/athlete_events.csv")
  .then(function (data) {
    // Define initial demographic
    let selectedDemographic = "Age";
    let selectedSeason = "Summer"; // Default to Summer
    updateChart(selectedDemographic, selectedSeason);

    // Event listener for dropdown change
    d3.select("#demographic").on("change", function () {
      selectedDemographic = d3.select(this).property("value");
      updateChart(selectedDemographic, selectedSeason);
    });

    // Event listener for season toggle change
    d3.select("#season-toggle").on("change", function () {
      selectedSeason = this.checked ? "Winter" : "Summer";
      updateChart(selectedDemographic, selectedSeason);
    });

    // Function to update chart based on selected demographic and season
    function updateChart(demographic, season) {
      // Clear previous chart
      d3.select("#chart").html("");
      d3.select("#x-axis-label").text("");

      // Filter data based on selected season
      let filteredData = data.filter((d) => d.Season === season);

      // Filter data to include only athletes who have won a medal
      filteredData = filteredData.filter((d) => d.Medal !== "NA");

      if (demographic === "Sex") {
        // Filter out NaN values for Sex
        filteredData = filteredData.filter(
          (d) => d.Sex === "M" || d.Sex === "F"
        );
      } else {
        // Filter out NaN values for other demographics
        filteredData = filteredData.filter(
          (d) => !isNaN(Number(d[demographic]))
        );
      }

      // Group data based on selected demographic
      let groupedData;
      if (demographic === "Sex") {
        groupedData = d3.group(filteredData, (d) => d.Sex);
      } else {
        groupedData = d3.group(filteredData, (d) =>
          Math.floor(Number(d[demographic]) / getInterval(demographic))
        );
      }

      // Calculate number of medals for each group
      const counts = Array.from(groupedData, ([key, value]) => ({
        key,
        count: value.length,
      }));

      // Sort counts based on x-axis ranges
      counts.sort((a, b) => {
        if (demographic === "Sex") {
          return a.key.localeCompare(b.key);
        } else {
          return a.key - b.key;
        }
      });

      // Calculate ranges for x-axis labels
      let ranges;
      if (demographic === "Sex") {
        ranges = counts.map((d) => d.key);
      } else {
        ranges = counts.map(
          (d) =>
            `${d.key * getInterval(demographic)} - ${
              (d.key + 1) * getInterval(demographic)
            }`
        );
      }

      // Set up chart dimensions
      const margin = { top: 50, right: 30, bottom: 50, left: 60 }; // Adjusted margins
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Append SVG to the chart div
      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define color scale with gradient
      const colorScale = d3
        .scaleLinear()
        .domain([0, d3.max(counts, (d) => d.count)])
        .range(["#ff8888", "#ff6666"]); // lighter to darker red gradient

      // Define scales
      const x = d3.scaleBand().domain(ranges).range([0, width]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(counts, (d) => d.count)])
        .nice()
        .range([height, 0]);

      // Draw bars
      svg
        .selectAll("rect")
        .data(counts)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(ranges[i]))
        .attr("y", (d) => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.count))
        .attr("fill", (d) => colorScale(d.count)) // Using color scale
        .on("mouseover", function (d) {
          // Add value text on hover
          d3.select(this).attr("opacity", 0.7);
          svg
            .selectAll(".bar-label")
            .data(counts)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", (d, i) => x(ranges[i]) + x.bandwidth() / 2) // Center text within each bar
            .attr("y", (d) => y(d.count) - 5) // Adjusted y position
            .attr("dy", "-0.7em")
            .attr("text-anchor", "middle")
            .attr("fill", "black") // Set text color to black
            .style("font-size", "12px") // Set font size
            .style("font-weight", "bold") // Set font weight
            .text((d) => d.count);
        })
        .on("mouseout", function () {
          // Remove value text and reset opacity on mouseout
          d3.select(this).attr("opacity", 1);
          svg.selectAll(".bar-label").remove();
        });

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      // Add y-axis
      svg.append("g").call(d3.axisLeft(y));

      // Add axis labels
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Medals")
        .attr("class", "y-axis-label"); // Add a class for styling

      // Update x-axis label
      d3.select("#x-axis-label").text(demographic).style("display", "block");
    }

    // Function to get interval for age, height, and weight
    function getInterval(demographic) {
      if (demographic === "Age") return 5;
      else if (demographic === "Height") return 5;
      else if (demographic === "Weight") return 10;
      else return 1;
    }
  })
  .catch(function (error) {
    console.log(error);
  });
