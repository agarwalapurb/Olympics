var createBubbleMap = () => {
  // set svg parameters
  const width = 1200,
  height = 700;
  const svg = d3.select("#viz_container")
  .append("svg")
  .attr("width",width)
  .attr("height",height)

  //set map scale, location on screen and its projection
  const projection = d3.geoRobinson()
    .scale(250)
    .center([0, 0])
    .translate([width/2.2, height/2]);

  //path generator
  const generator = d3.geoPath()
    .projection(projection);

  //declare polygon, polyline and bubble
  const poly = svg.append("g");
  const line = svg.append("g");
  const bubble = svg.append("g");

  // declare URL
  const polygonsURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_polygons_simplified.json";
  const polylinesURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_lines_simplified.json";

  //load data
  Promise.all([
  d3.csv("archive/athlete_events.csv"),
  d3.csv("archive/country-coord.csv")
  ]).then(function(files) {
  const population = files[0];
  const latlong = files[1];


  // Group by 'Season' and 'Team', and count the total medals
  const groupedData = d3.rollup(population, v => v.length, d => d.Season, d => d.Team);

  // Create a Map from the 'latlong' data
  const latlongMap = new Map(latlong.map(d => [d.Country, {Latitude: d.latitude, Longitude: d.longitude}]));
  // Convert the Map to an Array of objects for easier processing
  const nestedData = Array.from(groupedData, ([season, teams]) => ({
    season, 
    teams: Array.from(teams, ([team, count]) => {
        const match = latlongMap.get(team);
        return {
            team, 
            count, 
            Latitude: match ? match.Latitude : undefined,
            Longitude: match ? match.Longitude : undefined
        };
    })
  }));

  console.log(nestedData);
  const summerData = nestedData
    .filter(d => d.season === "Summer")
    .flatMap(d => d.teams.filter(t => t.Latitude !== undefined && t.Longitude !== undefined));

  const winterData = nestedData
    .filter(d => d.season === "Winter")
    .flatMap(d => d.teams.filter(t => t.Latitude !== undefined && t.Longitude !== undefined));

  console.log(summerData);
  console.log(winterData);

  //create a tooltip
  const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip1")
  .style("dispay","none");

  //tooltip and mouse events
  const mouseover = function(event,d) {
  f = d3.format(",")
  tooltip
  .style("display","block")
  .html("<strong>Country: </strong>"  + d.team + "<br>"+ "<strong>Medals: </strong>" + `${f(d.count)}`)
  .style("top", event.pageY - 20 + "px")
  .style("left", event.pageX + 10 + "px")
  //     .style("opacity", 1)
  // d3.select(this)
  //     .style("fill", "#589BE5")
  //     .style("stroke", "#EF4A60")
  //     .style("opacity", 1)
  };

  const mouseout = function() {
  tooltip
  .style("display", "none")
  };

  //set bubble scale
  const valueScale = d3.extent(summerData, d => +d.count)
  const size = d3.scaleSqrt()
  .domain(valueScale)
  .range([3,50]);

  // Initial data
  let currentData = summerData;

  // Update the visualization based on the current data
  updateVisualization(currentData);

  // Add event listener for the select element
  d3.select("#season-select").on("change", function() {
    const selectedSeason = d3.select(this).property("value");
    currentData = selectedSeason === "summer" ? summerData : winterData;
    updateVisualization(currentData);
  });

  //draw bubble
  function updateVisualization(data) {
    // Update your visualization based on the data
    // This is where you would add your existing D3.js code to create the visualization
    bubble
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
      .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
      .attr("r", d => size(+d.count))
      .style("fill", "#589BE5")
      .attr("stroke", "#0072BC")
      .attr("stroke-width", 0.5)
      .attr("fill-opacity", .6)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  }

  //Add legend
  const legendLabel = [100,5000,10000];
  const xCircle = 500;
  const xLabel = 555;
  svg
  .selectAll("legend")
  .data(legendLabel)
  .join("circle")
  .attr("cx", xCircle)
  .attr("cy", d => height*0.9 - size(d))
  .attr("r", d => size(d))
  .style("fill", "none")
  .attr("stroke", "#666666")
  .attr("stroke-width", 0.75);
  svg
  .selectAll("legend")
  .data(legendLabel)
  .join("line")
  .attr('x1', xCircle)
  .attr('x2', xLabel)
  .attr('y1', d => height*0.9 - size(d)*2)
  .attr('y2', d => height*0.9 - size(d)*2)
  .attr('stroke', '#666666')
  .attr("stroke-width", 0.75);
  svg
  .selectAll("legend")
  .data(legendLabel)
  .join("text")
  .attr('x', xLabel)
  .attr('y', d => height*0.9 - size(d)*2)
  .text(d => d3.format(",")(d))
  .style("font-size", 9)
  .style("fill", "#666666")
  .attr('alignment-baseline', 'middle')
  });

  //load and draw polygons
  d3.json(polygonsURL).then(function(topology) {
  poly
  .selectAll("path")
  .data(topojson.feature(topology, topology.objects.world_polygons_simplified).features)
  .join("path")
  .attr("fill", "#CCCCCC")
  .attr("d", generator);
  });

  //load and draw lines
  d3.json(polylinesURL).then(function(topology) {
  line
  .selectAll("path")
  .data(topojson.feature(topology, topology.objects.world_lines_simplified).features)
  .join("path")
  .style("fill","none")
  .attr("d", generator)
  .attr("class", d => d.properties.type)
  });

  // //set note
  // svg
  //   .append('text')
  //       .attr('class', 'note')
  //       .attr('x', width*0.01)
  //       .attr('y', height*0.96)
  //       .attr('text-anchor', 'start')
  //       .style('font-size', 7)
  //       .style("fill", "#666666")
  //   .text('Source: UNHCR Refugee Data Finder');
  // svg
  //   .append('text')
  //       .attr('class', 'note')
  //       .attr('x', width*0.01)
  //       .attr('y', height*0.99)
  //       .attr('text-anchor', 'start')
  //       .style('font-size', 7)
  //       .style("fill", "#666666")
  //   .text('The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.');
}

createBubbleMap();