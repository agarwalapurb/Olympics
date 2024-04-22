
const winterHostCities = [
    { name: "Chamonix", latitude: 45.9237, longitude: 6.8694, country: "France", year: [1924], performance: [
        { year: 1924, gold: 0, silver: 0, bronze: 3, rank: 9 },
    ] },
    { name: "St. Moritz", latitude: 46.4908, longitude: 9.8355, country: "Switzerland", year: [1928, 1948], performance: [
        { year: 1928, gold: 0, silver: 0, bronze: 1, rank: 8 },
        { year: 1948, gold: 3, silver: 4, bronze: 3, rank: 3 },
    ] },
    { name: "Lake Placid", latitude: 44.2795, longitude: -73.9799, country: "United States", year: [1932, 1980], performance: [
        { year: 1932, gold: 6, silver: 4, bronze: 2, rank: 1 },
        { year: 1980, gold: 6, silver: 4, bronze: 2, rank: 3 },
    ] },
    { name: "Garmisch-Partenkirchen", latitude: 47.4917, longitude: 11.0955, country: "Germany", year: [1936], performance: [
        { year: 1936, gold: 3, silver: 3, bronze: 0, rank: 2 },
    ] },
    { name: "Oslo", latitude: 59.9139, longitude: 10.7522, country: "Norway", year: [1952], performance: [
        { year: 1952, gold: 7, silver: 3, bronze: 6, rank: 1 },
    ] },
    { name: "Cortina d'Ampezzo", latitude: 46.5378, longitude: 12.1359, country: "Italy", year: [1956], performance: [
        { year: 1956, gold: 1, silver: 2, bronze: 0, rank: 8 },
    ] },
    { name: "Garmsich-Partenkirchen", latitude: 47.4917, longitude: 11.0955, country: "Germany", year: [1964], performance: [
        { year: 1964, gold: 3, silver: 3, bronze: 2, rank: 3 },
    ] },
    { name: "Grenoble", latitude: 45.1885, longitude: 5.7245, country: "France", year: [1968], performance: [
        { year: 1968, gold: 4, silver: 3, bronze: 2, rank: 3 },
    ] },
    { name: "Sapporo", latitude: 43.0618, longitude: 141.3545, country: "Japan", year: [1972, 2017], performance: [
        { year: 1972, gold: 1, silver: 1, bronze: 1, rank: 11 },
        { year: 2017, gold: 0, silver: 0, bronze: 0, rank: 0 },
    ] },
    { name: "Innsbruck", latitude: 47.2692, longitude: 11.4041, country: "Austria", year: [1964, 1976], performance: [
        { year: 1964, gold: 4, silver: 5, bronze: 3, rank: 2 },
        { year: 1976, gold: 2, silver: 2, bronze: 2, rank: 7 },
    ] },
    { name: "Albertville", latitude: 45.6755, longitude: 6.3922, country: "France", year: [1992], performance: [
        { year: 1992, gold: 3, silver: 5, bronze: 1, rank: 7 },
    ] },
    { name: "Lillehammer", latitude: 61.1153, longitude: 10.4662, country: "Norway", year: [1994], performance: [
        { year: 1994, gold: 10, silver: 11, bronze: 5, rank: 2 },
    ] },
    { name: "Nagano", latitude: 36.6485, longitude: 138.1950, country: "Japan", year: [1998], performance: [
        { year: 1998, gold: 5, silver: 1, bronze: 4, rank: 7 },
    ] },
    { name: "Sqauw Valley", latitude: 39.1970, longitude: -120.2357, country: "United States", year: [1960], performance: [
        { year: 1960, gold: 3, silver: 4, bronze: 3, rank: 3 },
    ] },
    { name: "Sarajevo", latitude: 43.8563, longitude: 18.4131, country: "Yugoslavia", year: [1984], performance: [
        { year: 1984, gold: 0, silver: 1, bronze: 0, rank: 14 },
    ] },
    { name: "Calgary", latitude: 51.0447, longitude: -114.0719, country: "Canada", year: [1988], performance: [
        { year: 1988, gold: 0, silver: 2, bronze: 3, rank: 13 },
    ] },
    { name: "Salt Lake City", latitude: 40.7608, longitude: -111.8910, country: "United States", year: [2002], performance: [
        { year: 2002, gold: 10, silver: 13, bronze: 11, rank: 3 },
    ] },
    { name: "Turin", latitude: 45.0703, longitude: 7.6869, country: "Italy", year: [2006], performance: [
        { year: 2006, gold: 5, silver: 0, bronze: 6, rank: 9 },
    ] },
    { name: "Vancouver", latitude: 49.2827, longitude: -123.1207, country: "Canada", year: [2010], performance: [
        { year: 2010, gold: 14, silver: 7, bronze: 5, rank: 1 },
    ] },
    { name: "Pyeongchang", latitude: 37.5567, longitude: 128.4826, country: "South Korea", year: [2018], performance: [
        { year: 2018, gold: 5, silver: 8, bronze: 4, rank: 7 },
    ] },
    { name: "Beijing", latitude: 39.9042, longitude: 116.4074, country: "China", year: [2022], performance: [
        { year: 2022, gold: 9, silver: 4, bronze: 2, rank: 4 },
    ] },
    { name: "Sochi", latitude: 43.6028, longitude: 39.7342, country: "Russia", year: [2014], performance: [
        { year: 2014, gold: 11, silver: 10, bronze: 9, rank: 1 },
    ] },
];


const summerHostCities = [
    { name: "London", latitude: 51.5072, longitude: -0.1278, country: "Great Britain", year: [1908, 1948, 2012], performance: [
        { year: 1908, gold: 56, silver: 51, bronze: 39, rank: 1 },
        { year: 1948, gold: 3, silver: 14, bronze: 6, rank: 12 },
        { year: 2012, gold: 29, silver: 18, bronze: 18, rank: 3 }
    ] },
    { name: "Athens", latitude: 37.9838, longitude: 23.7275, country: "Greece", year: [1896, 2004], performance: [
        { year: 1896, gold: 10, silver: 18, bronze: 19, rank: 2 },
        { year: 2004, gold: 6, silver: 6, bronze: 4, rank: 15 }
    ] },
    { name: "Stockholm", latitude: 59.3293, longitude: 18.0686, country: "Sweden", year: [1912], performance: [
        { year: 1912, gold: 23, silver: 25, bronze: 17, rank: 2 }
    ] },
    { name: "Berlin", latitude: 52.5200, longitude: 13.4050, country: "Germany", year: [1936], performance: [
        { year: 1936, gold: 38, silver: 31, bronze: 32, rank: 1 }
    ] },
    { name: "Tokyo", latitude: 35.6764, longitude: 139.6500, country: "Japan", year: [1964, 2020], performance: [
        { year: 1964, gold: 16, silver: 5, bronze: 8, rank: 3 },
        { year: 2020, gold: 27, silver: 14, bronze: 17, rank: 3 }
    ] },
    { name: "Mexico City", latitude: 19.4326, longitude: -99.1332, country: "Mexico", year: [1968], performance: [
        { year: 1968, gold: 3, silver: 3, bronze: 3, rank: 15 }
    ] },
    { name: "Munich", latitude: 48.1351, longitude: 11.5820, country: "Germany", year: [1972], performance: [
        { year: 1972, gold: 13, silver: 11, bronze: 16, rank: 4 }
    ] },
    { name: "Montreal", latitude: 45.5019, longitude: -73.5674, country: "Canada", year: [1976], performance: [
        { year: 1976, gold: 0, silver: 5, bronze: 6, rank: 27 }
    ] },
    { name: "Moscow", latitude: 55.7558, longitude: 37.6173, country: "Soviet Union", year: [1980], performance: [
        { year: 1980, gold: 80, silver: 69, bronze: 46, rank: 1 }
    ] },
    { name: "Los Angeles", latitude: 34.0549, longitude: -118.2426, country: "United States", year: [1932, 1984, 2028], performance: [
        { year: 1932, gold: 41, silver: 32, bronze: 30, rank: 1 },
        { year: 1984, gold: 83, silver: 61, bronze: 30, rank: 1 }
    ] },
    { name: "Seoul", latitude: 37.5519, longitude: 126.9918, country: "South Korea", year: [1988], performance: [
        { year: 1988, gold: 12, silver: 10, bronze: 11, rank: 4 }
    ] },
    { name: "Barcelona", latitude: 41.3874, longitude: 2.1686, country: "Spain", year: [1992], performance: [
        { year: 1992, gold: 13, silver: 7, bronze: 2, rank: 6 }
    ] },
    { name: "Atlanta", latitude: 33.7488, longitude: -84.3877, country: "United States", year: [1996], performance: [
        { year: 1996, gold: 44, silver: 32, bronze: 25, rank: 1 }
    ] },
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia", year: [2000], performance: [
        { year: 2000, gold: 16, silver: 25, bronze: 17, rank: 4 }
    ] },
    { name: "Beijing", latitude: 39.9042, longitude: 116.4074, country: "China", year: [2008], performance: [
        { year: 2008, gold: 48, silver: 22, bronze: 30, rank: 1 }
    ] },
    { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, country: "Brazil", year: [2016], performance: [
        { year: 2016, gold: 7, silver: 6, bronze: 6, rank: 13 }
    ] },
    { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France", year: [1900, 1924, 2024], performance: [
        { year: 1900, gold: 27, silver: 38, bronze: 37, rank: 1 },
        { year: 1924, gold: 13, silver: 15, bronze: 10, rank: 3 }
    ] },
    { name: "St. Louis", latitude: 38.6270, longitude: -90.1994, country: "United States", year: [1904], performance: [
        { year: 1904, gold: 76, silver: 78, bronze: 77, rank: 1 }
    ] },
    { name: "Antwerp", latitude: 51.2213, longitude: 4.4051, country: "Belgium", year: [1920], performance: [
        { year: 1920, gold: 14, silver: 11, bronze: 11, rank: 5 }
    ] },
    { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, country: "Netherlands", year: [1928], performance: [
        { year: 1928, gold: 6, silver: 9, bronze: 4, rank: 8 }
    ] },
    { name: "Helsinki", latitude: 60.1699, longitude: 24.9384, country: "Finland", year: [1952], performance: [
        { year: 1952, gold: 6, silver: 3, bronze: 13, rank: 8 }
    ] },
    { name: "Melbourne", latitude: -37.8136, longitude: 144.9631, country: "Australia", year: [1956], performance: [
        { year: 1956, gold: 13, silver: 8, bronze: 14, rank: 3 }
    ] },
    { name: "Rome", latitude: 41.8967, longitude: 12.4822, country: "Italy", year: [1960], performance: [
        { year: 1960, gold: 13, silver: 10, bronze: 13, rank: 3 }
    ] },
    // Add more host cities here
];


function createLineChart(country, season) {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 50, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Remove any existing SVG elements in the "#line-chart" div
    d3.select("#line-chart").selectAll("*").remove();

    // Append the SVG object to the div called "line-chart"    
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load CSV data
    file_name = "archive/summer_host_data.csv"
    color = "red";
    if (season === "Winter") {
        file_name = "archive/winter_host_data.csv"
        color = "blue";
    }
    d3.csv(file_name).then(function (data) {
        // Extract data for the selected country
        const countryData = data.map(d => ({ Year: +d.Games, Rank: +d[country] }));

        // Filter out data points with rank 0 or NaN
        const filteredData = countryData.filter(d => d.Rank > 0 && !isNaN(d.Rank));

        // Get the maximum rank for the y-axis domain
        const maxRank = d3.max(filteredData, d => d.Rank);

        // X axis
        const x = d3.scaleLinear()
            .domain([1892, 2024]) // Fixed range from 1896 to 2020
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Y axis
        const y = d3.scaleLinear()
            .domain([0, maxRank]) // Dynamic range based on the maximum rank
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Rank));

        svg.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);

        // Add circles for each data point
        svg.selectAll(".dot")
            .data(filteredData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d.Rank))
            .attr("r", 5)
            .attr("fill", color) // Set color of scatter plot points
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Year: " + d.Year + "<br/>Rank: " + d.Rank)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add x-axis title
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        // Add y-axis title
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Rank");

        // Add chart title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", "-5px")
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .html("<tspan style='font-weight:bold'>" + country + "</tspan>");
    });
}


function makeHostCitiesMap(season) {
    // Define the data
    d3.select("#host_map").selectAll("svg").remove();

    hostCities = summerHostCities;
    color = "red";

    if (season === "Winter") {
        hostCities = winterHostCities;
        color = "blue";
    }

    createLineChart("United States", season);

    // Set up the SVG dimensions
    const width = 800;
    const height = 400;

    // Create the SVG element
    const svg = d3.select("#host_map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    // svg.append("defs")
    //     .append("linearGradient")
    //     .attr("id", "ocean-gradient")
    //     .attr("gradientUnits", "userSpaceOnUse")
    //     .attr("x1", 0).attr("y1", 0)
    //     .attr("x2", 0).attr("y2", height)
    //     .selectAll("stop")
    //     .data([
    //         {offset: "0%", color: "#add8e6"}, // Light blue
    //         {offset: "100%", color: "#87ceeb"} // Deep sky blue
    //     ])
    //     .enter().append("stop")
    //     .attr("offset", d => d.offset)
    //     .attr("stop-color", d => d.color);
    
    // svg.append("rect")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .style("fill", "url(#ocean-gradient)");

    
    
    
    
    // Create tooltip container
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load world map data
    d3.json("https://unpkg.com/world-atlas@1/world/110m.json").then(world => {
        const countries = topojson.feature(world, world.objects.countries);

        // Define a projection
        const projection = d3.geoEquirectangular()
            .fitSize([width, height], countries);

        // Define a path generator
        const path = d3.geoPath()
            .projection(projection);

        // Draw the map
        svg.selectAll(".country")
            .data(countries.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", "#e0e0e0")
            .style("stroke", "black");
            

        // Plot host cities
        svg.selectAll(".city-marker")
            .data(hostCities)
            .enter().append("circle")
            .attr("class", "city-marker")
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .attr("r", 4)
            .style("fill", color)
            .on("click", function(event, d) {
                createLineChart(d.country, season);
                // console.log("hiiii");
                // console.log(d.country);
            })
            .on("mouseover", (event, d) => {
                // Display tooltip with message "HI"
                tooltip.html(`<strong>${d.name}</strong><br>
                        ${d.country} <img src="images/${d.country}.png" width="20" height="15"><br><br>
                        <strong>Performance:</strong><br>
                        ${d.performance.map(perf => `
                            Year: ${perf.year}<br>
                            <img src="images/gold.webp" width="15" height="15">: ${perf.gold}<br>
                            <img src="images/silver.webp" width="15" height="15">: ${perf.silver}<br>
                            <img src="images/bronze.png" width="15" height="15">: ${perf.bronze}<br>
                            Rank: ${perf.rank}<br>
                            <br>`).join('')}
                        `)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", () => {
                // Hide tooltip on mouseout
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        
        const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

        function zoomed(event) {
            svg.attr("transform", event.transform);
        }

        svg.call(zoom);
    });
}

document.getElementById("season-togglea").addEventListener("change", function() {
    // Get the current season selection
    const season = this.checked ? "Winter" : "Summer";
    // Call makeHostCitiesMap function with the selected season
    makeHostCitiesMap(season);

    // Update the sport display based on the selected season
  if (season === 'Winter') {
    $('#season-labela').text('Winter');
} else {
    $('#season-labela').text('Summer');
}
});

makeHostCitiesMap("Summer");
createLineChart("United States", "Summer");
