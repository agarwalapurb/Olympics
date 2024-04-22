// function createMedalsChart(data) {
//     // Chart dimensions
//     const margin = { top: 20, right: 30, bottom: 60, left: 100 }; // Increased bottom margin for x-axis labels
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     // Select the container div and append a heading
//     const container = d3.select('#performance_chart');
//     container.html(''); // Clear existing content
//     container.append('h2').text('Performance');

//     // Create SVG element
//     const svg = container
//         .append('svg')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', height + margin.top + margin.bottom)
//         .append('g')
//         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//     // Define scales
//     const xScale = d3.scaleLinear()
//         .domain([-d3.max(data, function(d) { return Math.abs(d.summer); }), d3.max(data, function(d) { return Math.abs(d.winter); })])
//         .range([0, width / 2]); // Adjusted range for left side

//     const yScale = d3.scaleBand()
//         .domain(data.map(function(d) { return d.country; }))
//         .range([0, height])
//         .padding(0.1);

//     // Create summer bars
//     svg.selectAll('.summer-bar')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('class', 'summer-bar')
//         .attr('x', function(d) { return width / 2 - xScale(Math.abs(d.summer)); }) // Start from the same position as winter bars
//         .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Start from middle line
//         .attr('width', function(d) { return xScale(Math.abs(d.summer)); }) // Adjust width based on value
//         .attr('height', yScale.bandwidth() / 2) // Thin the bars
//         .style('fill', 'orange');

//     // Create winter bars
//     svg.selectAll('.winter-bar')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('class', 'winter-bar')
//         .attr('x', width / 2)
//         .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Start from middle line
//         .attr('width', function(d) { return xScale(Math.abs(d.winter)); }) // Adjust width based on value
//         .attr('height', yScale.bandwidth() / 2) // Thin the bars
//         .style('fill', 'blue');

//     // Add country labels on the extreme left
//     svg.selectAll('.country-label')
//         .data(data)
//         .enter()
//         .append('text')
//         .attr('class', 'country-label')
//         .attr('x', -5) // Adjust position to the left of the chart
//         .attr('y', function(d) { return yScale(d.country) + yScale.bandwidth() / 2; }) // Center vertically
//         .attr('dy', '0.35em') // Center horizontally
//         .text(function(d) { return d.country; });

//     // Add scale on both sides of the graph
//     svg.append('text')
//         .attr('x', width / 4)
//         .attr('y', 30)
//         .style('text-anchor', 'middle')
//         .text('Summer Medals');

//     svg.append('text')
//         .attr('x', 3 * width / 4)
//         .attr('y', 30)
//         .style('text-anchor', 'middle')
//         .text('Winter Medals');

//     svg.append('text')
//         .attr('x', width / 4)
//         .attr('y', -10)
//         .style('text-anchor', 'middle')
//         .text('0');

//     svg.append('text')
//         .attr('x', 3 * width / 4)
//         .attr('y', -10)
//         .style('text-anchor', 'middle')
//         .text('0');

//     // Add x-axis line
//     svg.append('line')
//         .attr('x1', 0)
//         .attr('y1', height)
//         .attr('x2', width)
//         .attr('y2', height)
//         .style('stroke', '#ccc');

//     // Add x-axis labels
//     svg.selectAll('.x-axis-label')
//         .data(xScale.ticks(5))
//         .enter()
//         .append('text')
//         .attr('class', 'x-axis-label')
//         .attr('x', function(d) { return width / 2 + xScale(d); }) // Adjust position based on scale
//         .attr('y', height + 20)
//         .style('text-anchor', 'middle')
//         .text(function(d) { return Math.abs(d); });

//     // Add center line
//     svg.append('line')
//         .attr('x1', width / 2)
//         .attr('y1', 0)
//         .attr('x2', width / 2)
//         .attr('y2', height)
//         .style('stroke', '#ccc');
// }

// // Sample data (replace with your actual data)
// const data = [
//     { country: 'USA', winter: 100, summer: 500 },
//     { country: 'Canada', winter: 150, summer: 300 },
//     // Add more data...
// ];

// // Call the function with the data
// createMedalsChart(data);


async function createMedalsChart() {
    try {
        // Fetch data from CSV files
        const [athleteData, nocRegions] = await Promise.all([d3.csv("archive/athlete_events.csv"), fetchNOCRegions()]);
        
        // Filter data for Summer and Winter Olympics separately
        const summerData = athleteData.filter(d => d.Season === "Summer");
        const winterData = athleteData.filter(d => d.Season === "Winter");
        
        // Process data for Summer Olympics
        const uniqueSummerData = Array.from(new Set(summerData.map(createKey)))
            .map(key => {
                const [team, noc, year, medal, sport, event] = key.split("-");
                return {
                    Team: team,
                    NOC: noc,
                    Year: parseInt(year),
                    Medal: medal,
                    Sport: sport,
                    Event: event
                };
            });
        
        const summerMedalData = d3.rollup(uniqueSummerData, 
            v => ({ 
                gold: v.filter(d => d.Medal === 'Gold').length,
                silver: v.filter(d => d.Medal === 'Silver').length,
                bronze: v.filter(d => d.Medal === 'Bronze').length
            }), 
            d => d.NOC
        );

        const aggregatedSummerMedals = Array.from(summerMedalData, ([noc, medals]) => {
            const region = nocRegions.find(region => region.NOC === noc)?.region || "Unknown";
            return { region, medals };
        }).reduce((acc, { region, medals }) => {
            if (!acc[region]) {
                acc[region] = medals;
            } else {
                acc[region] = {
                    gold: acc[region].gold + medals.gold,
                    silver: acc[region].silver + medals.silver,
                    bronze: acc[region].bronze + medals.bronze
                };
            }
            return acc;
        }, {});

        const stackedSummerMedalData = Object.entries(aggregatedSummerMedals).map(([region, medals]) => ({
            region,
            ...medals,
            total: medals.gold + medals.silver + medals.bronze
        }));

        // Process data for Winter Olympics
        const uniqueWinterData = Array.from(new Set(winterData.map(createKey)))
            .map(key => {
                const [team, noc, year, medal, sport, event] = key.split("-");
                return {
                    Team: team,
                    NOC: noc,
                    Year: parseInt(year),
                    Medal: medal,
                    Sport: sport,
                    Event: event
                };
            });
        
        const winterMedalData = d3.rollup(uniqueWinterData, 
            v => ({ 
                gold: v.filter(d => d.Medal === 'Gold').length,
                silver: v.filter(d => d.Medal === 'Silver').length,
                bronze: v.filter(d => d.Medal === 'Bronze').length
            }), 
            d => d.NOC
        );

        const aggregatedWinterMedals = Array.from(winterMedalData, ([noc, medals]) => {
            const region = nocRegions.find(region => region.NOC === noc)?.region || "Unknown";
            return { region, medals };
        }).reduce((acc, { region, medals }) => {
            if (!acc[region]) {
                acc[region] = medals;
            } else {
                acc[region] = {
                    gold: acc[region].gold + medals.gold,
                    silver: acc[region].silver + medals.silver,
                    bronze: acc[region].bronze + medals.bronze
                };
            }
            return acc;
        }, {});

        const stackedWinterMedalData = Object.entries(aggregatedWinterMedals).map(([region, medals]) => ({
            region,
            ...medals,
            total: medals.gold + medals.silver + medals.bronze
        }));

        // Combine the data for both Summer and Winter Olympics
        const combinedData = [];
        for (let i = 0; i < stackedSummerMedalData.length; i++) {
            combinedData.push({
                region: stackedSummerMedalData[i].region,
                summerGold: stackedSummerMedalData[i].gold,
                summerSilver: stackedSummerMedalData[i].silver,
                summerBronze: stackedSummerMedalData[i].bronze,
                summerTotal: stackedSummerMedalData[i].total,
                winterGold: stackedWinterMedalData[i] ? stackedWinterMedalData[i].gold : 0,
                winterSilver: stackedWinterMedalData[i] ? stackedWinterMedalData[i].silver : 0,
                winterBronze: stackedWinterMedalData[i] ? stackedWinterMedalData[i].bronze : 0,
                winterTotal: stackedWinterMedalData[i] ? stackedWinterMedalData[i].total : 0
            });
        }

        // Sort the combined data by total medals
        combinedData.sort((a, b) => (b.summerTotal + b.winterTotal) - (a.summerTotal + a.winterTotal));

        // Take top 10 countries
        const topCountries = combinedData.slice(0, 10);

        // Update chart visualization
        console.log(topCountries)
        updatePerformanceChart(topCountries);
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

function updatePerformanceChart(data) {
    // Chart dimensions
    const margin = { top: 40, right: 50, bottom: 60, left: 50 }; // Adjusted margins for labels
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const center_space = 2;

    // Select the container div and append a heading
    const container = d3.select('#performance_chart');
    container.html(''); // Clear existing content

    // Create SVG element
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Define scales
    const maxTotal = d3.max(data, function(d) { return Math.max(d.summerTotal, d.winterTotal); });
    // console.log(maxTotal)
    const xScale = d3.scaleLinear()
        .domain([0, maxTotal])
        .range([0, width / 2.5]); // Adjusted range for left side

    const yScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.region; }))
        .range([0, height])
        .padding(0.1);

    // Create summer bars
    svg.selectAll('.summer-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'summer-bar')
        .attr('x', function(d) { return width / 2 - xScale(Math.abs(d.summerTotal)) - center_space + 1; }) // Start from the same position as winter bars
        .attr('y', function(d) { return yScale(d.region); })
        .attr('width', function(d) { return xScale(Math.abs(d.summerTotal)) - center_space + 1; }) // Adjust width based on value
        .attr('height', yScale.bandwidth()) // Thin the bars
        .style('fill', 'orange')
        // .append('title')
        // .text(function(d) { return `${d.region}\nTotal: ${d.summerTotal + d.winterTotal}\nSummer: ${d.summerTotal}\nWinter: ${d.winterTotal}`; })
        .on("mouseover", function(event, d) {
            const region = d.region;
            const total = d.summerTotal + d.winterTotal;
            const summerTotal = d.summerTotal;
            const winterTotal = d.winterTotal;
        
            // Highlight the current bar
            d3.select(this).attr("opacity", 1.0);
        
            // Dim all other bars
            svg.selectAll(".summer-bar:not(:hover)").attr("opacity", 0.2);
            svg.selectAll(".winter-bar:not(:hover)").attr("opacity", 0.2);
        
            // Show tooltip with region name and medal counts
            d3.select("#popup")
                .style("display", "block")
                .html(`<strong>${region}</strong><br>
                Total Medals: ${total}<br>
                Summer Medals: ${summerTotal}<br>
                Winter Medals: ${winterTotal}`)
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px");
        })
        .on("mouseout", function() {
            // Reset opacity for all bars
            svg.selectAll(".summer-bar").attr("opacity", 1.0);
            svg.selectAll(".winter-bar").attr("opacity", 1.0);
        
            // Hide the tooltip
            d3.select("#popup").style("display", "none");
        });
        

    // Create winter bars
    svg.selectAll('.winter-bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'winter-bar')
        .attr('x', function(d) { return width / 2 + center_space; }) // Start from the center line
        .attr('y', function(d) { return yScale(d.region); })
        .attr('width', function(d) { return xScale(Math.abs(d.winterTotal)) + center_space; }) // Adjust width based on value
        .attr('height', yScale.bandwidth()) // Thin the bars
        .style('fill', 'blue')
        // .append('title')
        // .text(function(d) { return `${d.region}\nTotal: ${d.summerTotal + d.winterTotal}\nSummer: ${d.summerTotal}\nWinter: ${d.winterTotal}`; })
        .on("mouseover", function(event, d) {
            const region = d.region;
            const total = d.summerTotal + d.winterTotal;
            const summerTotal = d.summerTotal;
            const winterTotal = d.winterTotal;
        
            // Highlight the current bar
            d3.select(this).attr("opacity", 1.0);
            
            // Dim all other bars
            svg.selectAll(".summer-bar:not(:hover)").attr("opacity", 0.2);
            svg.selectAll(".winter-bar:not(:hover)").attr("opacity", 0.2);
        
            // Show tooltip with region name and medal counts
            d3.select("#popup")
                .style("display", "block")
                .html(`<strong>${region}</strong><br>
                Total Medals: ${total}<br>
                Summer Medals: ${summerTotal}<br>
                Winter Medals: ${winterTotal}`)
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px");
        })
        .on("mouseout", function() {
            // Reset opacity for all bars
            svg.selectAll(".summer-bar").attr("opacity", 1.0);
            svg.selectAll(".winter-bar").attr("opacity", 1.0);
        
            // Hide the tooltip
            d3.select("#popup").style("display", "none");
        });
        
    // Add summer and winter medals labels
    svg.selectAll('.medals-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'medals-label')
        .attr('x', function(d) { return width / 2 - xScale(Math.abs(d.summerTotal)) - 35 - center_space; }) // Adjust position for summer medals
        .attr('y', function(d) { return yScale(d.region) + yScale.bandwidth() / 2; }) // Center vertically
        .attr('dy', '0.35em') // Center horizontally
        .text(function(d) { return d.summerTotal; });

    svg.selectAll('.medals-label-winter')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'medals-label-winter')
        .attr('x', function(d) { return width / 2 + xScale(Math.abs(d.winterTotal)) + 5 + center_space; }) // Adjust position for winter medals
        .attr('y', function(d) { return yScale(d.region) + yScale.bandwidth() / 2; }) // Center vertically
        .attr('dy', '0.35em') // Center horizontally
        .text(function(d) { return d.winterTotal; });

    // Add country labels on the extreme left
    svg.selectAll('.country-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', -5) // Adjust position to the left of the chart
        .attr('y', function(d) { return yScale(d.region) + yScale.bandwidth() / 2; }) // Center vertically
        .attr('dy', '0.35em') // Center horizontally
        .text(function(d) { return d.region; });

    // Add scale on both sides of the graph
    svg.append('text')
        .attr('x', width / 4)
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .text('Summer Olympics');

    svg.append('text')
        .attr('x', 3 * width / 4)
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .text('Winter Olympics');

    // Add x-axis line
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', height)
        .style('stroke', '#ccc');

    // Add x-axis labels
    svg.selectAll('.x-axis-label')
        .data(d3.range(-2500, 2501, 500))
        .enter()
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', function(d) { return width / 2 + xScale(Math.abs(d)) * Math.sign(d); }) // Adjust position based on scale
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
    // Add Y-axis title
    svg.append('text')
    .attr('class', 'y-axis-title')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 20)
    .style('text-anchor', 'middle')
    .text('Countries');

    // Add X-axis title
    svg.append('text')
    .attr('class', 'x-axis-title')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Number of Medals Won');

}
    
createMedalsChart();