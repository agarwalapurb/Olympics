// Define the data for the line chart
const lineChartData = [
    { year: 1900, gold: 27, silver: 38, bronze: 37 },
    { year: 1904, gold: 76, silver: 78, bronze: 77 },
    { year: 1908, gold: 56, silver: 51, bronze: 39 },
    // Add more data points here...
];

// Set up dimensions for the line chart
const chartWidth = 900;
const chartHeight = 200;
const margin = { top: 20, right: 30, bottom: 30, left: 60 };
const width = chartWidth - margin.left - margin.right;
const height = chartHeight - margin.top - margin.bottom;

// Create SVG element for the line chart
const lineChartSvg = d3.select("#host_line_chart")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create scales for x and y axes
const xScale = d3.scaleLinear()
    .domain(d3.extent(lineChartData, d => d.year))
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(lineChartData, d => d.gold + d.silver + d.bronze)])
    .range([height, 0]);

// Create axis generators
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Add x axis
lineChartSvg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

// Add y axis
lineChartSvg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Define line functions for gold, silver, and bronze
const lineGold = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.gold));

const lineSilver = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.gold + d.silver));

const lineBronze = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.gold + d.silver + d.bronze));

// Add gold line
lineChartSvg.append("path")
    .datum(lineChartData)
    .attr("class", "line-gold")
    .attr("d", lineGold);

// Add silver line
lineChartSvg.append("path")
    .datum(lineChartData)
    .attr("class", "line-silver")
    .attr("d", lineSilver);

// Add bronze line
lineChartSvg.append("path")
    .datum(lineChartData)
    .attr("class", "line-bronze")
    .attr("d", lineBronze);
