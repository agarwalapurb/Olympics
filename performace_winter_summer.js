// // Function to fetch data from CSV file and populate sports dropdown based on selected season
// async function selectSportPerformance() {
//     const data = await d3.csv("archive/athlete_events.csv");
//     const sportsDropdown = document.getElementById("sport-selected");
//     const sports = Array.from(new Set(data.map(d => d.Sport)));

//     sports.sort();
//     // Clear existing options
//     sportsDropdown.innerHTML = "";

//     // Populate dropdown with sports
//     sports.forEach(sport => {
//         const option = document.createElement("option");
//         option.text = sport;
//         sportsDropdown.add(option);
//     });
// }

// async function fetchNOCRegions() {
//     return await d3.csv("archive/noc_regions.csv");
// }


// Function to initialize the year range slider
function selectYearPerformance() {
    return new Promise((resolve, reject) => {
        const yearRange = document.getElementById('year-range-selected');
        const yearRangeValue = document.getElementById('year-range-value-selected');

        noUiSlider.create(yearRange, {
            start: [1896, 2016],
            connect: true,
            step: 1,
            range: {
                'min': 1896,
                'max': 2016
            }
        });

        yearRange.noUiSlider.on('update', function (values, handle) {
            const parsedValues = values.map(val => parseInt(val));
            yearRangeValue.textContent = parsedValues.join(' - ');
        });

        resolve();
    });
}


// Function to initialize the stacked bar chart and event listeners
async function initializePerformance() {
    try {
        await Promise.all([selectYearPerformance()]);
        // await Promise.all([selectSportPerformance(), selectYearPerformance()]);

        // const sportDropdown = document.getElementById("sport-selected");
        const yearRangeSlider = document.getElementById("year-range-selected");


        sportDropdown.value = "Swimming";
        // Update the stacked bar chart with initial values
        updateChartPerformance();

        // Event listeners
        // sportDropdown.addEventListener("change", updateChartPerformance);
        yearRangeSlider.noUiSlider.on('change', updateChartPerformance);
    } catch (error) {
        console.log("Error initializing:", error);
    }
}


// Function to update the stacked bar chart based on selected season and sport
function updateChartPerformance() {
    // const selectedSport = document.getElementById("sport-selected").value;
    const yearRange = document.getElementById("year-range-selected").noUiSlider.get();
    const startYear = Math.round(yearRange[0]);
    const endYear = Math.round(yearRange[1]);

    // createMedalsChart(selectedSport, startYear, endYear);
    createMedalsChart(startYear, endYear);
}

// Call initialize function when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePerformance);


function emptyPerformanceDataVisualization() {
    d3.select("#performance_chart svg").selectAll("*").remove();
            
    // Append text element with message
    const svg = d3.select("#performance_chart svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const message = "No data available for the selected criteria";
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "20px")
        .text(message);

}

// async function createMedalsChart(selectedSport, startYear, endYear) {
async function createMedalsChart(startYear, endYear) {
    try {
        // Fetch data from CSV files

        // console.log(selectedSport, startYear, endYear)
        const [athleteData, nocRegions] = await Promise.all([d3.csv("archive/athlete_events.csv"), fetchNOCRegions()]);

        startYear = Math.round(startYear); 
        endYear = Math.round(endYear);
        
        let summerData;
        let winterData;
        
        if (startYear === endYear) {
            endYear += 0.5; 
        } 
        // else {
        //     winterData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Sport === selectedSport && d.Season === "Winter");
        // }
        // summerData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Sport === selectedSport && d.Season === "Summer");
        // winterData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Sport === selectedSport && d.Season === "Winter");
        summerData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Season === "Summer");
        winterData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Season === "Winter");
        
        // Check if filteredData is empty
        // if (summerData.length === 0 && winterData.length === 0) {
        //     emptyFilteredDataVisualization();
        //     return; // Exit function
        // }
        // console.log("hi")
        
        // Filter data for Summer and Winter Olympics separately
        // const summerData = athleteData.filter(d => d.Season === "Summer");
        // const winterData = athleteData.filter(d => d.Season === "Winter");
        
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
        // console.log(stackedWinterMedalData)

        // Combine the data for both Summer and Winter Olympics
        const combinedData = [];
        stackedSummerMedalData.forEach(summerData => {
            const winterData = stackedWinterMedalData.find(winterData => winterData.region === summerData.region);
            
            combinedData.push({
                region: summerData.region,
                summerGold: summerData.gold,
                summerSilver: summerData.silver,
                summerBronze: summerData.bronze,
                summerTotal: summerData.total,
                winterGold: winterData ? winterData.gold : 0,
                winterSilver: winterData ? winterData.silver : 0,
                winterBronze: winterData ? winterData.bronze : 0,
                winterTotal: winterData ? winterData.total : 0
            });
        });
        
        // Sort the combined data by total medals
        combinedData.sort((a, b) => (b.summerTotal + b.winterTotal) - (a.summerTotal + a.winterTotal));

        // Take top 10 countries
        const topCountries = combinedData.slice(0, 10).reverse();

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
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + 20 + "px");
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
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + 20 + "px");
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
    svg.selectAll('.y-axis-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', -18) // Adjust position to the left of the chart
        .attr('y', function(d) { return yScale(d.region) + yScale.bandwidth() / 2; }) // Center vertically
        .attr('dy', '0.35em') // Center horizontally
        .text(function(d) { return d.region; });

    // Add scale on both sides of the graph
    svg.append('text')
        .attr('x', width / 4)
        .attr('y', -5)
        .style('text-anchor', 'middle')
        .text('Summer Olympics');

    svg.append('text')
        .attr('x', 3 * width / 4)
        .attr('y', -5)
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
    let xRange = (parseInt(maxTotal/500)+1)*500;
    let numScale = xRange / 5;
    svg.selectAll('.x-axis-label')
        .data(d3.range(- xRange, xRange+1, numScale))
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
    .attr('y', -margin.left + 14)
    .style('text-anchor', 'middle')
    .text('Region');

    // Add X-axis title
    svg.append('text')
    .attr('class', 'x-axis-title')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Number of Medals Won');

}
    
// createMedalsChart();