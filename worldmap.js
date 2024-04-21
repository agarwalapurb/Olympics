(function() {
    // Set up the SVG canvas
    const containerWidth = 1050;
    const containerHeight = 550;

        // Create year selection dropdown
        const yearDropdown = d3.select("#map-container")
        .append("select")
        .attr("id", "year-select")
        .style("position", "relative")
        .style("top", "10px") // Adjust top offset as needed
        .style("right", "-10px") // Adjust right offset as needed
        .on("change", function() {
          const selectedYear = this.value;
          console.log("Selected year:", selectedYear);
          // You can add logic here to update the map based on the selected year
        });

    const containerSvg = d3.select("#map-container")
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Create a tooltip
    const tooltip = d3.select("#map-container")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "10px")
      .style("border-radius", "5px");



    // Populate year selection dropdown with options from 1896 to 2012
    // Add the default "Year" option
    yearDropdown.append("option")
      .attr("value", "")
      .text("Year");

    // Populate year selection dropdown with options every four years from 1896 to 2012
    for (let year = 1896; year <= 2012; year += 4) {
      yearDropdown.append("option")
        .attr("value", year)
        .text(year);
    }


    // Load the world map data
    d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries);

        // Define projection
        const projection = d3.geoMercator()
          .fitSize([containerWidth, containerHeight], countries)
          .translate([containerWidth / 2, 2*containerHeight / 3])
          .scale((containerWidth / 7)  );

        // Define path generator
        const path = d3.geoPath().projection(projection);

        // Load the CSV file that maps country codes to names
        d3.csv("archive/merged_data3.csv").then(countryData => {
          // Create a mapping between country codes and names
          const countryNamesById = {};
          countryData.forEach(country => {
            countryNamesById[country["country-code"]] = country["name"];
          });

          // Draw the map
          containerSvg.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#ddd")
            .attr("stroke", "#555")
            .on("click", function(event, d) {
              const countryId = d.id;
              const countryName = countryNamesById[countryId] || "Unknown";
              console.log("You clicked on " + countryName);
              // You can add more logic here to display information about the selected country
            })
            .on("mouseover", function(event, d) {
              const countryId = d.id;
              const countryName = countryNamesById[countryId] || "Unknown";
              const selectedYear = document.getElementById("year-select").value;
              const countryDataForYear = countryData.find(country => country["country-code"] === countryId && country.Year === selectedYear);

              // Show tooltip with country name and medal counts
              if (countryDataForYear) {
                const goldCount = countryDataForYear.GoldCount || 0;
                const silverCount = countryDataForYear.SilverCount || 0;
                const bronzeCount = countryDataForYear.BronzeCount || 0;
                tooltip.style("visibility", "visible")
                  .html(`
                    <div>${countryName}</div>
                    <div>Gold: ${goldCount}</div>
                    <div>Silver: ${silverCount}</div>
                    <div>Bronze: ${bronzeCount}</div>
                  `);
              } else {
                const goldCount =  0;
                const silverCount =  0;
                const bronzeCount =  0;
                tooltip.style("visibility", "visible")
                  .html(`
                    <div>${countryName}</div>
                    <div>Gold: ${goldCount}</div>
                    <div>Silver: ${silverCount}</div>
                    <div>Bronze: ${bronzeCount}</div>
                  `);
              }

              // Highlight the country
              d3.select(this).attr("fill", "lightblue");
            })
            .on("mousemove", function(event) {
              // Position tooltip relative to mouse pointer
              tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
              // Hide tooltip when mouse leaves
              tooltip.style("visibility", "hidden");

              // Restore original fill color
              d3.select(this).attr("fill", "#ddd");
            });
        });

      })
      .catch(error => {
        console.error("Error loading map data:", error);
      });
})();
