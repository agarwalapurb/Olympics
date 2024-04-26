// sports_stacked_bar_chart.js

async function populateSportsDropdown(selectedSeason) {
    const data = await d3.csv("archive/athlete_events.csv");
    const sportsDropdown = document.getElementById("sport1");
    const sports = Array.from(new Set(data.filter(d => d.Season === selectedSeason).map(d => d.Sport)));

    sports.sort();
    sportsDropdown.innerHTML = "";

    sports.forEach(sport => {
        const option = document.createElement("option");
        option.text = sport;
        sportsDropdown.add(option);
    });
}

async function fetchNOCRegions() {
    return await d3.csv("archive/noc_regions.csv");
}

// Initialize the year range slider
function initializeYearRangeSlider() {
    return new Promise((resolve, reject) => {
        const yearRange = document.getElementById('year-range');
        const yearRangeValue = document.getElementById('year-range-value');

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

// Initialize the stacked bar chart
async function initialize() {
    try {
        await Promise.all([populateSportsDropdown("Summer"), initializeYearRangeSlider()]);

        const sportDropdown = document.getElementById("sport1");
        const yearRangeSlider = document.getElementById("year-range");
        sportDropdown.value = "Swimming";
        updateChart();

        // Event listeners
        sportDropdown.addEventListener("change", updateChart);
        yearRangeSlider.noUiSlider.on('change', updateChart);
    } catch (error) {
        console.log("Error initializing:", error);
    }
}

// update the stacked bar chart based on selected season and sport
function updateChart() {
    const selectedSport = document.getElementById("sport1").value;
    const yearRange = document.getElementById("year-range").noUiSlider.get();
    const startYear = Math.round(yearRange[0]);
    const endYear = Math.round(yearRange[1]);
    const selectedSeason = document.querySelector(".toggle-button1.active").textContent;

    createStackedBarChart(selectedSport, startYear, endYear, selectedSeason);
}

document.getElementById("summer-toggle1").addEventListener("click", function() {
    document.getElementById("summer-toggle1").classList.add("active");
    document.getElementById("winter-toggle1").classList.remove("active");
    populateSportsDropdown("Summer").then(updateChart).catch(error => console.log("Error:", error));
});

document.getElementById("winter-toggle1").addEventListener("click", function() {
    document.getElementById("winter-toggle1").classList.add("active");
    document.getElementById("summer-toggle1").classList.remove("active");
    populateSportsDropdown("Winter").then(updateChart).catch(error => console.log("Error:", error));
});

// Call initialize function when DOM is loaded
document.addEventListener("DOMContentLoaded", initialize);

function preprocessTeamName(teamName) {
    const parts = teamName.split('-');
    return parts[0];
}

function createKey(entry) {
    const team = preprocessTeamName(entry.Team);

    return `${team}-${entry.NOC}-${entry.Year}-${entry.Medal}-${entry.Sport}-${entry.Event}`;
}

function emptyFilteredDataVisualization() {
    d3.select("#chart1 svg").selectAll("*").remove();
            
    // Append text element with message
    const svg = d3.select("#chart1 svg");
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

async function createStackedBarChart(selectedSport, startYear, endYear, selectedSeason) {
    try {
        const [athleteData, nocRegions] = await Promise.all([d3.csv("archive/athlete_events.csv"), fetchNOCRegions()]);

        startYear = Math.round(startYear); 
        endYear = Math.round(endYear);
        
        let filteredData;
        
        if (startYear === endYear) {
            endYear += 0.5; 
            filteredData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Sport === selectedSport && d.Season === selectedSeason);
        } else {
            filteredData = athleteData.filter(d => d.Year >= startYear && d.Year <= endYear && d.Sport === selectedSport && d.Season === selectedSeason);
        }
        
        // Check if filteredData is empty
        if (filteredData.length === 0) {
            emptyFilteredDataVisualization();
            return;
        }
        
        d3.select("#chart1 svg").selectAll("text").remove();

        const uniqueData = Array.from(new Set(filteredData.map(createKey)))
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

        const medalData = d3.rollup(uniqueData, 
            v => ({ 
                gold: v.filter(d => d.Medal === 'Gold').length,
                silver: v.filter(d => d.Medal === 'Silver').length,
                bronze: v.filter(d => d.Medal === 'Bronze').length
            }), 
            d => d.NOC
        );
        // console.log("Check", uniqueData);
        // console.log("Data", medalData);

        // Convert the map to an object with regions as keys and aggregated medal counts as values
        const aggregatedMedals = Array.from(medalData, ([noc, medals]) => {
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

        // Convert the aggregated object back to an array of objects
        const stackedMedalData = Object.entries(aggregatedMedals).map(([region, medals]) => ({
            region,
            ...medals
        }));

        // Sort data
        stackedMedalData.sort((a, b) => {
            if (a.gold !== b.gold) return b.gold - a.gold;
            if (a.silver !== b.silver) return b.silver - a.silver;
            return b.bronze - a.bronze;
        });

        // console.log("After", stackedMedalData);
        
        const totalMedals = stackedMedalData.reduce((acc, country) => {
            acc.gold += country.gold;
            acc.silver += country.silver;
            acc.bronze += country.bronze;
            return acc;
        }, { gold: 0, silver: 0, bronze: 0 });
        
        const topCountries = stackedMedalData.slice(0, 8);
        // Calculate total medals for top countries
        const topCountriesTotal = topCountries.reduce((acc, country) => {
            acc.gold += country.gold;
            acc.silver += country.silver;
            acc.bronze += country.bronze;
            return acc;
        }, { gold: 0, silver: 0, bronze: 0 });
        
        // Calculate medals for "rest"
        const restMedals = {
            gold: totalMedals.gold - topCountriesTotal.gold,
            silver: totalMedals.silver - topCountriesTotal.silver,
            bronze: totalMedals.bronze - topCountriesTotal.bronze
        };
        
        // Add "rest" as a separate entry
        const stackedMedalDataWithRest = [...topCountries, { region: "Rest", ...restMedals }];
        
        // Pass stackedMedalDataWithRest to updateChartVisualization function
        updateChartVisualization(stackedMedalDataWithRest);

        // console.log("Data passed to updateChartVisualization:", topCountries);
        // updateChartVisualization(topCountries);

    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

function updateChartVisualization(data) {
    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 20, bottom: 60, left: 60 }; // Increased bottom and left margins

    const svg = d3.select("#chart1 svg");

    // Define color scale
    const color = d3.scaleOrdinal()
        .domain(["gold", "silver", "bronze"])
        .range(["#FFD700", "#C0C0C0", "#CD7F32"]);

    // Stack the data
    const stack = d3.stack().keys(["gold", "silver", "bronze"]);
    const stackedData = stack(data.map(d => ({ ...d, total: d.gold + d.silver + d.bronze })));

    // Define x and y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([margin.left, width - margin.right])
        .padding(0.1);
        
    const y = d3.scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Update bars
    svg.selectAll("g").remove();

    const bars = svg.selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("class", d => `bar ${d.data.region.toLowerCase()}`) // Assign class based on region
        .attr("x", (d, i) => x(data[i].region))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        // Add hover functionality
        .on("mouseover", function(event, d) {
            const region = d.data.region;
            // Highlight all bars of the same class
            svg.selectAll(`.bar.${region.toLowerCase()}`)
                .attr("opacity", 1.0);
            svg.selectAll(".bar")
                .filter(bar => bar.data.region !== region)
                .attr("opacity", 0.2);
            d3.select("#popup")
            .style("display", "block")
            .html(`<strong>${region}</strong><br>
            Gold: ${d.data.gold} <span style="color: #FFD700; font-size: 20px">&#x25CF;</span><br>
            Silver: ${d.data.silver} <span style="color: #C0C0C0; font-size: 20px">&#x25CF;</span><br>
            Bronze: ${d.data.bronze} <span style="color: #CD7F32; font-size: 20px">&#x25CF;</span>`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + 20 + "px");
        })
        .on("mouseout", function() {
            // Reset opacity for all bars
            svg.selectAll("rect").attr("opacity", 1);
            d3.select("#popup").style("display", "none");
        });

    // Add x-axis title
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll(".tick text")
    .attr("font-size", "12px");

    // Append x-axis title separately
    svg.append("text")
    .attr("class", "axis-title")
    .attr("x", margin.left + (width - margin.left - margin.right) / 2)
    .attr("y", height - 10) 
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Region");


  // Append y-axis with adjusted scale text font size
    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .selectAll(".tick text")
    .attr("font-size", "12px");

    // Append y-axis title separately
    svg.append("text")
    .attr("class", "axis-title") 
    .attr("transform", `translate(${margin.left - 40},${height / 2-10}) rotate(-90)`)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Number of Medals");


    // Add legend
    const legend = svg => {
        const legendWidth = 100;
        const legendHeight = color.domain().length * 20;
        const g = svg
            .attr("transform", `translate(${width - margin.right - legendWidth},${margin.top})`) 
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        g.append("rect")
            .attr("x", -19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);

        g.append("text")
            .attr("x", -24)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => capitalizeFirstLetter(d)); 

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    };

    svg.append("g")
        .call(legend);
}
