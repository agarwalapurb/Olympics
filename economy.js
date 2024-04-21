// Load data from CSV files
Promise.all([
    d3.csv("archive/MedalTally.csv"),
    d3.csv("archive/GDP.csv"),
    d3.csv("archive/GINI.csv"),
    d3.csv("archive/GNI.csv"),
    d3.csv("archive/LITERACY.csv"),
    d3.csv("archive/UNEMPLOYMENT.csv")

]).then(function(files) {

    var medalData = files[0];

    var gdpData = [];

    // Convert data into tabular format
    files[1].forEach(function(d) {
        var country = d.Country;
        for (var year in d) {
            if (year !== "Country") {
                gdpData.push({
                    country: country,
                    year: year.toString(),
                    val: +d[year]/1e9
                });
            }
        }
    });

    var giniData = [];

    // Convert data into tabular format
    files[2].forEach(function(d) {
        var country = d.Country;
        for (var year in d) {
            if (year !== "Country") {
                giniData.push({
                    country: country,
                    year: year.toString(),
                    val: +d[year]
                });
            }
        }
    });

    var gniData = [];

    // Convert data into tabular format
    files[3].forEach(function(d) {
        var country = d.Country;
        for (var year in d) {
            if (year !== "Country") {
                gniData.push({
                    country: country,
                    year: year.toString(),
                    val: +d[year]
                });
            }
        }
    });

    var literacy = [];

    // Convert data into tabular format
    files[4].forEach(function(d) {
        var country = d.Country;
        for (var year in d) {
            if (year !== "Country") {
                literacy.push({
                    country: country,
                    year: year.toString(),
                    val: +d[year]
                });
            }
        }
    });

    var unemployment = [];

    // Convert data into tabular format
    files[5].forEach(function(d) {
        var country = d.Country;
        for (var year in d) {
            if (year !== "Country") {
                unemployment.push({
                    country: country,
                    year: year.toString(),
                    val: +d[year]
                });
            }
        }
    });

    
    var economyVariableDropdown = document.getElementById("economy-variable");

    economyVariableDropdown.addEventListener("change", function() {
        var selectedEconomyVariable = this.value;
        loadEconomyVariableData(selectedEconomyVariable);
    });

    // Function to load data for selected economy variable
    function loadEconomyVariableData(selectedEconomyVariable) {
        // Load data for the selected economy variable
        // Replace this with your actual code to load data for different economic indices
        var selectedEconomyVariableData;
        var economyVariableLabelText;

        // Load data for the selected economy variable
        switch(selectedEconomyVariable) {
            case "GDP":
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
            case "gini":
                selectedEconomyVariableData = giniData;
                economyVariableLabelText = "GINI INDEX";
                break;
            case "gni":
                // Load data for GNI index
                selectedEconomyVariableData = gniData;
                economyVariableLabelText = "GNI (in USD)";
                break;
            case "unemployment":
                // Load data for unemployment index
                selectedEconomyVariableData = unemployment;
                economyVariableLabelText = "Unemployment (% of total labour force)";
                break;
            case "literacy":
                // Load data for literacy index
                selectedEconomyVariableData = literacy;
                economyVariableLabelText = "Literacy (% of people age 15+)";
                break;
            default:
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
        }
        // Get selected medal type and year
        var selectedMedalType = document.getElementById("medal-type").value;
        var selectedYear = document.getElementById("year-slider").value;

        console.log(selectedMedalType, selectedYear, selectedEconomyVariable);


        // Create scatter plot with the selected data
        createScatterPlot(selectedEconomyVariableData, medalData, selectedMedalType, selectedYear, economyVariableLabelText);
    }

    // Event listener for medal type dropdown
    var medalTypeDropdown = document.getElementById("medal-type");

    medalTypeDropdown.addEventListener("change", function() {
        var selectedMedalType = this.value;
        // var selectedMedalType = "Bronze"
        var selectedEconomyVariable = document.getElementById("economy-variable").value;
        var selectedYear = document.getElementById("year-slider").value;

        var selectedEconomyVariableData;
        var economyVariableLabelText;

        // Load data for the selected economy variable
        switch(selectedEconomyVariable) {
            case "GDP":
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
            case "gini":
                selectedEconomyVariableData = giniData;
                economyVariableLabelText = "GINI INDEX";
                break;
            case "gni":
                // Load data for GNI index
                selectedEconomyVariableData = gniData;
                economyVariableLabelText = "GNI (in USD)";
                break;
            case "unemployment":
                // Load data for unemployment index
                selectedEconomyVariableData = unemployment;
                economyVariableLabelText = "Unemployment (% of total labour force)";
                break;
            case "literacy":
                // Load data for literacy index
                selectedEconomyVariableData = literacy;
                economyVariableLabelText = "Literacy (% of people age 15+)";
                break;
            default:
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
        }
        // console.log(selectedYear)
        // var selectedYear = "2016";
        console.log(selectedMedalType, selectedYear, selectedEconomyVariable);
        createScatterPlot(selectedEconomyVariableData, medalData, selectedMedalType, selectedYear, economyVariableLabelText);
    });

    // Event listener for year slider
    var yearSlider = document.getElementById("year-slider");

    yearSlider.addEventListener("input", function() {
        var selectedYear = this.value;
        var selectedEconomyVariable = document.getElementById("economy-variable").value;
        var selectedEconomyVariableData;
        var economyVariableLabelText;

        // Load data for the selected economy variable
        switch(selectedEconomyVariable) {
            case "GDP":
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
            case "gini":
                selectedEconomyVariableData = giniData;
                economyVariableLabelText = "GINI INDEX";
                break;
            case "gni":
                // Load data for GNI index
                selectedEconomyVariableData = gniData;
                economyVariableLabelText = "GNI (in USD)";
                break;
            case "unemployment":
                // Load data for unemployment index
                selectedEconomyVariableData = unemployment;
                economyVariableLabelText = "Unemployment (% of total labour force)";
                break;
            case "literacy":
                // Load data for literacy index
                selectedEconomyVariableData = literacy;
                economyVariableLabelText = "Literacy (% of people age 15+)";
                break;
            default:
                selectedEconomyVariableData = gdpData;
                economyVariableLabelText = "GDP (in USD Billion)";
                break;
        }
        var selectedMedalType = document.getElementById("medal-type").value;
        console.log(selectedMedalType, selectedYear, selectedEconomyVariable);
        createScatterPlot(selectedEconomyVariableData, medalData, selectedMedalType, selectedYear, economyVariableLabelText);

    });


}).catch(function(error) {
    console.log("Error loading data:", error);
});

function createScatterPlot(Data, medalData, selectedMedalType, selectedYear, economyVariableLabelText) {
    try {
        // Filter medalData based on selected medal type and year
        var filteredMedalData = medalData.filter(function(d) {
            return d.Year === selectedYear;
            // && d[1] === selectedMedalType;
        });
        console.log(filteredMedalData)
        
        var DataForYear = Data.filter(function(entry) {
            return entry.year === selectedYear;
        });
        console.log(DataForYear)
        // Create a set to store unique countries from filteredMedalData
        var filteredCountries = new Set(filteredMedalData.map(entry => entry.region));

        // Create a new array to store merged data
        var mergedData = [];

        // Loop through each entry in gdpDataForYear
        DataForYear.forEach(function(Entry) {
            // Check if the country from gdpDataForYear exists in filteredCountries set
            if (filteredCountries.has(Entry.country)) {
                // Find the corresponding entry in filteredMedalData based on the country/region
                var filteredEntry = filteredMedalData.find(function(filteredEntry) {
                    // Compare the region from filteredData with the country from gdpDataForYear
                    return filteredEntry.region === Entry.country;
                });

                // Combine data from both datasets into a new object
                var mergedEntry = {
                    country: Entry.country,
                    year: Entry.year,
                    val: Entry.val,
                    // Add medal data from filteredData
                    Bronze: filteredEntry.Bronze,
                    Gold: filteredEntry.Gold,
                    Silver: filteredEntry.Silver,
                    total_count: filteredEntry.total_count
                };

                // Push the merged entry into the mergedData array
                mergedData.push(mergedEntry);
            }
        });

        // Now the mergedData array contains the merged data from both datasets,
        // but only for the selected year and the countries present in filteredMedalData
        console.log(mergedData);

        temp = mergedData;
        // Sort mergedData array based on total_count property
        temp.sort((a, b) => b.total_count - a.total_count);

        // Log sorted mergedData array to the console
        console.log(mergedData);



        // Define SVG dimensions and margins
        var width = 600;
        var height = 500;
        var margin = { top: 20, right: 20, bottom: 50, left: 50 };

        // Create SVG element
        var svg = d3.select("#scatterplot")
            .html("") // Clear previous content
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Define scales for x and y axes
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(mergedData, d => +d.val)]) // Assuming 'gdp' is the column name for GDP in gdpData
            .range([margin.left, width - margin.right]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(mergedData, d => +d[selectedMedalType])]) // Assuming 'total_count' is the column name for total medal count in medalData
            .range([height - margin.bottom, margin.top]);

        // console.log(d3.max(mergedData, d => +d.selectedMedalType))
        // Define the tooltip element
        // Create tooltip container
        const tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
        // Create circles for scatter plot
        svg.selectAll("circle")
            .data(mergedData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(+d.val))
            .attr("cy", d => yScale(+d[selectedMedalType]))
            .attr("r", 8) // Set radius of circles
            .attr("country", d => d.country) // Set country name
            .attr("fill", "steelblue") // Set fill color
            .append('title')
            .text((d) => `${d.country}`);

        // Append x-axis
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(xScale));

        // Append y-axis
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale));

        // Append gridlines for x-axis
        svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(xScale)
            .tickSize(-height + margin.top + margin.bottom)
            .tickFormat("")
        );

        // Append gridlines for y-axis
        svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale)
            .tickSize(-width + margin.left + margin.right)
            .tickFormat("")
        );


        // Add labels for axes
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 3)
            .style("text-anchor", "middle")
            .text(economyVariableLabelText);//will change acc to index selected

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 55)
            .attr("x", -height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Medal Count");

    } catch (error) {
        console.error('Error in createScatterPlot:', error);
    }
}

