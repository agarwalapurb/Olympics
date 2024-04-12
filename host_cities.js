// Define the data
const hostCities = [
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

// Set up the SVG dimensions
const width = 900;
const height = 450;

// Create the SVG element
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
        .style("fill", "white")
        .style("stroke", "black");

    // Plot host cities
    svg.selectAll(".city-marker")
        .data(hostCities)
        .enter().append("circle")
        .attr("class", "city-marker")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 4)
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
});
