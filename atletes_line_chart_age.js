// Load data from CSV file
d3.csv("archive/athlete_events.csv").then(function(data) {
    // Define initial demographic
    let selectedDemographic = "Age";
    updateChart(selectedDemographic);

    // Event listener for dropdown change
    d3.select("#demographic").on("change", function() {
        selectedDemographic = d3.select(this).property("value");
        updateChart(selectedDemographic);
    });

    // Function to update chart based on selected demographic
    function updateChart(demographic) {
        // Clear previous chart
        d3.select("#chart").html("");
        d3.select("#x-axis-label").text("");

        let filteredData;
        if (demographic === "Sex") {
            // Filter out NaN values for Sex
            filteredData = data.filter(d => d.Sex === "M" || d.Sex === "F");
        } else {
            // Filter out NaN values for other demographics
            filteredData = data.filter(d => !isNaN(Number(d[demographic])));
        }

        // Group data based on selected demographic
        let groupedData;
        if (demographic === "Sex") {
            groupedData = d3.group(filteredData, d => d.Sex);
        } else {
            groupedData = d3.group(filteredData, d => Math.floor(Number(d[demographic]) / getInterval(demographic)));
        }

        // Calculate number of medals for each group
        const counts = Array.from(groupedData, ([key, value]) => ({ key, count: value.length }));

        // Calculate ranges for x-axis labels
        let ranges;
        if (demographic === "Sex") {
            ranges = counts.map(d => d.key);
        } else {
            ranges = counts.map(d => `${d.key * getInterval(demographic)} - ${(d.key + 1) * getInterval(demographic)}`);
        }

        // Sort ranges
        ranges.sort((a, b) => {
            if (!isNaN(Number(a.split('-')[0])) && !isNaN(Number(b.split('-')[0]))) {
                return Number(a.split('-')[0]) - Number(b.split('-')[0]);
            }
            return a.localeCompare(b);
        });

        // Set up chart dimensions
        const margin = { top: 50, right: 30, bottom: 50, left: 60 }; // Adjusted margins
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Append SVG to the chart div
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define color scale
        const colorScale = d3.scaleLinear()
            .domain([0, d3.max(counts, d => d.count)])
            .range(["#2c7bb6", "#0d4f91"]); // Darker color range

        // Define scales
        const x = d3.scaleBand()
            .domain(ranges)
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(counts, d => d.count)])
            .nice()
            .range([height, 0]);

        // Draw bars
        svg.selectAll("rect")
            .data(counts)
            .enter().append("rect")
            .attr("x", (d, i) => x(ranges[i]))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count))
            .attr("fill", d => colorScale(d.count)) // Using color scale
            .on("mouseover", function(d) {
                // Add value text on hover
                svg.append("text")
                    .attr("class", "hover-text")
                    .attr("x", x(ranges[counts.indexOf(d)]) + x.bandwidth() / 2)
                    .attr("y", y(d.count) - 10) // Adjusted y position
                    .attr("text-anchor", "middle")
                    .text(d.count);
            })
            .on("mouseout", function() {
                // Remove value text on mouseout
                svg.selectAll(".hover-text").remove();
            });

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add axis labels
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Medals")
            .attr("class", "y-axis-label"); // Add a class for styling

        // Update x-axis label
        d3.select("#x-axis-label")
            .text(demographic)
            .style("display", "block");
    }

    // Function to get interval for age, height, and weight
    function getInterval(demographic) {
        if (demographic === "Age") return 5;
        else if (demographic === "Height" || demographic === "Weight") return 5;
        else return 1;
    }
}).catch(function(error) {
    console.log(error);
});
