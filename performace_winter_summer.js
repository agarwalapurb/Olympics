function createMedalsChart(data) {
    // Chart dimensions
    var margin = { top: 20, right: 30, bottom: 60, left: 100 }; // Increased bottom margin for x-axis labels
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Select the container div and append a heading
    var container = d3.select('#performance_chart');
    container.html(''); // Clear existing content
    container.append('h2').text('Performance');

    // Create SVG element
    var svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define scales
    var xScale = d3.scaleLinear()
        .domain([-d3.max(data, function(d) { return Math.abs(d.summer); }), d3.max(data, function(d) { return Math.abs(d.winter); })])
        .range([0, width / 2]); // Adjusted range for left side

    var yScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.country; }))
        .range([0, height])
        .padding(0.1);

    // Create summer bars
    svg.selectAll('.summer-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'summer-bar')
        .attr('x', function(d) { return width / 2 - xScale(Math.abs(d.summer)); }) // Start from the same position as winter bars
        .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Start from middle line
        .attr('width', function(d) { return xScale(Math.abs(d.summer)); }) // Adjust width based on value
        .attr('height', yScale.bandwidth() / 2) // Thin the bars
        .style('fill', 'orange');

    // Create winter bars
    svg.selectAll('.winter-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'winter-bar')
        .attr('x', width / 2)
        .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Start from middle line
        .attr('width', function(d) { return xScale(Math.abs(d.winter)); }) // Adjust width based on value
        .attr('height', yScale.bandwidth() / 2) // Thin the bars
        .style('fill', 'blue');

    // Add country labels on the extreme left
    svg.selectAll('.country-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', -5) // Adjust position to the left of the chart
        .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Center vertically
        .attr('dy', '0.35em') // Center horizontally
        .text(function(d) { return d.country; });

    // Add scale on both sides of the graph
    svg.append('text')
        .attr('x', width / 4)
        .attr('y', 30)
        .style('text-anchor', 'middle')
        .text('Summer Medals');

    svg.append('text')
        .attr('x', 3 * width / 4)
        .attr('y', 30)
        .style('text-anchor', 'middle')
        .text('Winter Medals');

    svg.append('text')
        .attr('x', width / 4)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .text('0');

    svg.append('text')
        .attr('x', 3 * width / 4)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .text('0');

    // Add x-axis line
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', height)
        .style('stroke', '#ccc');

    // Add x-axis labels
    svg.selectAll('.x-axis-label')
        .data(xScale.ticks(5))
        .enter()
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', function(d) { return width / 2 + xScale(d); }) // Adjust position based on scale
        .attr('y', height + 20)
        .style('text-anchor', 'middle')
        .text(function(d) { return Math.abs(d); });

    // Add center line
    svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', 0)
        .attr('x2', width / 2)
        .attr('y2', height)
        .style('stroke', '#ccc');
}

// Sample data (replace with your actual data)
var data = [
    { country: 'USA', winter: 100, summer: 500 },
    { country: 'Canada', winter: 150, summer: 300 },
    // Add more data...
];

// Call the function with the data
createMedalsChart(data);
