Chart.defaults.datasets.line.borderWidth = 4;


// Fetch and parse the "noc_regions.csv" file
fetch('archive\\noc_regions.csv')
  .then(response => response.text())
  .then(csvData => {
    // Parse CSV data
    const parsedData = Papa.parse(csvData, { header: true });

    // Extract data and populate the country list
    const countryDropdown = document.getElementById('countryDropdown');
    parsedData.data.forEach(row => {
      const noc = row['NOC'];
      const fullName = row['region'];
      const countryItemText = `${noc} (${fullName})`;

      // Check if the country is already present in the list
      const existingOption = [...countryDropdown.options].find(option => option.text === countryItemText);
      if (!existingOption) {
        const option = document.createElement('option');
        option.text = countryItemText;
        countryDropdown.add(option);
      }
    });
  })
  .catch(error => {
    console.error('Error loading or parsing CSV file:', error);
  });


// Populate year dropdown with options
const yearDropdown = document.getElementById('yearDropdown');
const currentYear = new Date().getFullYear();

fetch('archive\\athlete_events.csv')
.then(response => response.text())
.then(csvData => {
    // Parse CSV data
    const parsedData = Papa.parse(csvData, { header: true });

    yearList = new Set();
    parsedData.data.forEach(row => {
    yearList.add(row.Year)
    });

    const sortedArray = Array.from(yearList).sort();

    sortedArray.forEach(ele =>{
    const option = document.createElement('option');
    option.text = ele;
    yearDropdown.add(option);
    });

    
});

// Populate Sport dropdown with options
const sportDropdown = document.getElementById('sportDropdown');

fetch('archive\\athlete_events.csv')
.then(response => response.text())
.then(csvData => {
    // Parse CSV data
    const parsedData = Papa.parse(csvData, { header: true });

    sportList = new Set();
    parsedData.data.forEach(row => {
    sportList.add(row.Sport)
    });

    const sortedArray = Array.from(sportList).sort();

    sortedArray.forEach(ele =>{
    const option = document.createElement('option');
    option.text = ele;
    sportDropdown.add(option);
    });

    
});

const addSportBtn = document.getElementById('addSportBtn');
const sportListContainer = document.getElementById('sportList');

addSportBtn.addEventListener('click', function() {
    const selectedSport = sportDropdown.value;
    if (selectedSport) {
      // Check if the selected sport is already in the list
      const existingSportItem = document.querySelector(`.sport-item span[data-sport="${selectedSport}"]`);
      if (existingSportItem) {
        // Sport already exists in the list, do not add it again
        alert('Sport already added!');
        return;
      }
  
      // Create new sport item
      const sportItem = document.createElement('div');
      sportItem.classList.add('sport-item');
      sportItem.innerHTML = `
        <span data-sport="${selectedSport}">${selectedSport}</span>
        <button class="remove-btn">Remove</button>
      `;
      sportListContainer.appendChild(sportItem);
  
      // Add event listener to "Remove" button
      const removeBtn = sportItem.querySelector('.remove-btn');
      removeBtn.addEventListener('click', function() {
        sportItem.remove();
      });
    }
  });


// Add event listener to "Add" button in country
const addCountryBtn = document.getElementById('addCountryBtn');
const countryListContainer = document.getElementById('countryList');

addCountryBtn.addEventListener('click', function() {
    const selectedCountry = countryDropdown.value;
    if (selectedCountry) {
      // Check if the selected country is already in the list
      const existingCountryItem = document.querySelector(`.country-item span[data-country="${selectedCountry}"]`);
      if (existingCountryItem) {
        // Country already exists in the list, do not add it again
        alert('Country already added!');
        return;
      }
  
      // Create new country item
      const countryItem = document.createElement('div');
      countryItem.classList.add('country-item');
      countryItem.innerHTML = `
        <span data-country="${selectedCountry}">${selectedCountry}</span>
        <button class="remove-btn">Remove</button>
      `;
      countryListContainer.appendChild(countryItem);
  
      // Add event listener to "Remove" button
      const removeBtn = countryItem.querySelector('.remove-btn');
      removeBtn.addEventListener('click', function() {
        countryItem.remove();
      });
    }
  });

// Add event listener to "Add" button in year
const addYearBtn = document.getElementById('addYearBtn');
const yearListContainer = document.getElementById('yearList');

addYearBtn.addEventListener('click', function() {
    const selectedYear = yearDropdown.value;
    if (selectedYear) {
      // Check if the selected country is already in the list
      const existingYearItem = document.querySelector(`.year-item span[data-year="${selectedYear}"]`);
      if (existingYearItem) {
        // Country already exists in the list, do not add it again
        alert('Year already added!');
        return;
      }
  
      // Create new country item
      const yearItem = document.createElement('div');
      yearItem.classList.add('year-item');
      yearItem.innerHTML = `
        <span data-year="${selectedYear}">${selectedYear}</span>
        <button class="remove-btn">Remove</button>
      `;
      console.log(selectedYear)
      console.log(yearItem)
      yearListContainer.appendChild(yearItem);
  
      // Add event listener to "Remove" button
      const removeBtn = yearItem.querySelector('.remove-btn');
      removeBtn.addEventListener('click', function() {
        yearItem.remove();
      });
    }
  });

  

const typeDropdown = document.getElementById('typeDropdown');
const typeList = ["Both", "Winter", "Summer"];

for (let i = 0; i < typeList.length; i++) {
    const option = document.createElement('option');
    option.text = typeList[i];
    typeDropdown.add(option);
  }

const chartDropdown = document.getElementById('chartDropdown');
const chartTypeList = ["line","bar","pie","polarArea","radar"];

for (let i = 0; i < chartTypeList.length; i++) {
    const option = document.createElement('option');
    option.text = chartTypeList[i];
    chartDropdown.add(option);
  }



// Handle form submission
const form = document.getElementById('olympicsForm');

var myChart = null;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        country: [],
        year: [],
        olympicType: typeDropdown.value,
        chartType: chartDropdown.value,
        sport: []
    };
  
    // ... existing code to populate formData.country and formData.year
    const countryItems = document.querySelectorAll('.country-item span');
    countryItems.forEach(item => {
      // Split the text by '(' and take the first part
      const countryCode = item.textContent.split('(')[0].trim();
      formData.country.push(countryCode);
    });

    const yearItems = document.querySelectorAll('.year-item span');
    yearItems.forEach(item => {
      formData.year.push(item.textContent);
    });

    const sportItems = document.querySelectorAll('.sport-item span');
    sportItems.forEach(item => {
      formData.sport.push(item.textContent);
    });

    // CONditions function calls starts here 

    if (formData.year.length === 0 && (formData.country.length === 0 || formData.country.length === 1) && formData.sport.length > 0) {
        plotAthletesBySport(formData);
        return
    }
    if (formData.year.length === 1 && (formData.country.length >0) && formData.sport.length > 0) {
        plotAthletesByYearWithSport(formData);
        return
    }

    if (formData.year.length === 0 && (formData.country.length > 1) && formData.sport.length === 1) {
        plotAthletesByCountryButOneSport(formData);
        return
    }

    if (formData.year.length === 0 && formData.country.length > 0) {
        plotAthletesByYear(formData);
        return
    }

    // CONDITION FUNCTION CALLS END HERE 

    // Fetch data and plot
    fetch('archive/athlete_events.csv')
    .then(response => response.text())
    .then(csvData => {
        // Parse CSV data
        const parsedData = Papa.parse(csvData, { header: true });

        // Initialize an object to hold athlete counts per country per year
        const countryYearAthleteCount = formData.year.reduce((acc, year) => {
            acc[year] = formData.country.reduce((countryAcc, country) => {
                countryAcc[country] = new Set();
                return countryAcc;
            }, {});
            return acc;
        }, {});

        // Process parsed CSV data
        parsedData.data.forEach(row => {
            if (formData.year.includes(row.Year) && 
                (formData.olympicType === 'Both' || row.Games.includes(formData.olympicType))) {
                const country = row.NOC; // 'NOC' column contains the country code
                const athlete = row.Name;
                const year = row.Year;
                if (countryYearAthleteCount.hasOwnProperty(year) && countryYearAthleteCount[year].hasOwnProperty(country)) {
                    countryYearAthleteCount[year][country].add(athlete);
                }
            }
        });

        // Create datasets for each year
        const datasets = formData.year.map(year => {
            const data = formData.country.map(country => countryYearAthleteCount[year][country].size);
            return {
                label: `Number of Players in ${year}`,
                data: data,
                borderWidth: 1,
                backgroundColor: generateRandomColor() // Helper function needed to generate random colors
            };
        });

        // Generate a random color for dataset background
        function generateRandomColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return `rgba(${r},${g},${b},1)`;
        }

        // Destroy the previous chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Plotting the data
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: formData.chartType,
            data: {
                labels: formData.country, // Common labels for all datasets (the list of countries)
                datasets: datasets // Array of datasets, one for each year
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
    });
});


function plotAthletesByYear(formData) {
    fetch('archive/athlete_events.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true });

        // Extract unique years from the CSV data and filter based on olympicType
        let years = new Set();
        parsedData.data.forEach(row => {
            if (formData.olympicType === 'Both' || row.Games.includes(formData.olympicType)) {
                years.add(row.Year);
            }
        });
        years = Array.from(years).sort();

        // Initialize country athlete count for each year
        const countryAthleteCounts = {};
        years.forEach(year => {
            countryAthleteCounts[year] = formData.country.reduce((acc, country) => {
                acc[country] = 0;
                return acc;
            }, {});
        });

        // Populate athlete counts
        parsedData.data.forEach(row => {
            if (years.includes(row.Year) && formData.country.includes(row.NOC)) {
                countryAthleteCounts[row.Year][row.NOC]++;
            }
        });

        // Create datasets for each country
        const datasets = formData.country.map(countryCode => {
            const data = years.map(year => countryAthleteCounts[year][countryCode]);
            return {
                label: `Number of Players from ${countryCode}`,
                data: data,
                borderWidth: 1,
                backgroundColor: generateRandomColor()
            };
        });

        // ... same chart initialization code

          // Generate a random color for dataset background
          function generateRandomColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return `rgba(${r},${g},${b},1)`;
        }

        // Destroy the previous chart if it exists
        if (myChart) {
            myChart.destroy();
        }



        // Plotting the data
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: formData.chartType,
            data: {
                labels: years, // Common labels for all datasets (the list of countries)
                datasets: datasets // Array of datasets, one for each year
            },
            options: {
                responsive: true, // Make the chart responsive to the window size
                maintainAspectRatio: false, // Disable the default aspect ratio
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////


function plotAthletesBySport(formData) {
    fetch('archive/athlete_events.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true });

        // Extract unique years from the CSV data and filter based on olympicType
        let years = new Set();
        parsedData.data.forEach(row => {
            if (formData.olympicType === 'Both' || row.Games.includes(formData.olympicType)) {
                years.add(row.Year);
            }
        });
        years = Array.from(years).sort();

        // Initialize country athlete count for each year
        const sportAthleteCounts = {};
        years.forEach(year => {
            sportAthleteCounts[year] = formData.sport.reduce((acc, sport) => {
                acc[sport] = 0;
                return acc;
            }, {});
        });

        // Populate athlete counts
        parsedData.data.forEach(row => {
            if (years.includes(row.Year) && formData.sport.includes(row.Sport)) {
                if(formData.country.length === 1){
                    if(formData.country.includes(row.NOC)){ sportAthleteCounts[row.Year][row.Sport]++;}
                }
                else{
                    sportAthleteCounts[row.Year][row.Sport]++;
                }
            }
        });

        // Create datasets for each country
        const datasets = formData.sport.map(sportCode => {
            const data = years.map(year =>sportAthleteCounts[year][sportCode]);
            return {
                label: `Number of Players in ${sportCode} ${formData.country}`,
                data: data,
                borderWidth: 1,
                backgroundColor: generateRandomColor()
            };
        });

        // ... same chart initialization code

          // Generate a random color for dataset background
          function generateRandomColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return `rgba(${r},${g},${b},1)`;
        }

        // Destroy the previous chart if it exists
        if (myChart) {
            myChart.destroy();
        }



        // Plotting the data
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: formData.chartType,
            data: {
                labels: years, // Common labels for all datasets (the list of countries)
                datasets: datasets // Array of datasets, one for each year
            },
            options: {
                responsive: true, // Make the chart responsive to the window size
                maintainAspectRatio: false, // Disable the default aspect ratio
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
    });
}


////////////////////////////////////////////////////////////////////////


function plotAthletesByCountryButOneSport(formData) {
    fetch('archive/athlete_events.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true });

        // Extract unique years from the CSV data and filter based on olympicType
        let years = new Set();
        parsedData.data.forEach(row => {
            if (formData.olympicType === 'Both' || row.Games.includes(formData.olympicType)) {
                years.add(row.Year);
            }
        });
        years = Array.from(years).sort();

        // Initialize country athlete count for each year
        const countryAthleteCounts = {};
        years.forEach(year => {
            countryAthleteCounts[year] = formData.country.reduce((acc, country) => {
                acc[country] = 0;
                return acc;
            }, {});
        });

        // Populate athlete counts
        parsedData.data.forEach(row => {
            if (years.includes(row.Year) && formData.country.includes(row.NOC)) {
                if(formData.sport.length === 1){
                    if(formData.sport.includes(row.Sport)){ countryAthleteCounts[row.Year][row.NOC]++;}
                }
                else{
                    countryAthleteCounts[row.Year][row.NOC]++;
                }
            }
        });

        // Create datasets for each country
        const datasets = formData.country.map(countryCode => {
            const data = years.map(year =>countryAthleteCounts[year][countryCode]);
            return {
                label: `Players in ${countryCode}(${formData.sport})`,
                data: data,
                borderWidth: 1,
                backgroundColor: generateRandomColor()
            };
        });

        // ... same chart initialization code

          // Generate a random color for dataset background
          function generateRandomColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return `rgba(${r},${g},${b},1)`;
        }

        // Destroy the previous chart if it exists
        if (myChart) {
            myChart.destroy();
        }



        // Plotting the data
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: formData.chartType,
            data: {
                labels: years, // Common labels for all datasets (the list of countries)
                datasets: datasets // Array of datasets, one for each year
            },
            options: {
                responsive: true, // Make the chart responsive to the window size
                maintainAspectRatio: false, // Disable the default aspect ratio
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
    });
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////

function plotAthletesByYearWithSport(formData) {
    fetch('archive/athlete_events.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true });

        const countries = formData.country;
        const sportAthleteCounts = {};

        // Initialize a nested object for each country and sport
        countries.forEach(country => {
            sportAthleteCounts[country] = {};
            formData.sport.forEach(sport => {
                sportAthleteCounts[country][sport] = 0;
            });
        });

        // Populate athlete counts
        parsedData.data.forEach(row => {
            if (countries.includes(row.NOC) && formData.sport.includes(row.Sport)) {
                if (formData.year.length === 0 || formData.year.includes(row.Year)) {
                    sportAthleteCounts[row.NOC][row.Sport]++;
                }
            }
        });

        // Create datasets for each sport
        const datasets = formData.sport.map(sport => {
            const data = countries.map(country => sportAthleteCounts[country][sport]);
            return {
                label: `Players in ${sport}(${formData.year.join(', ')})`, // Adjust if multiple years
                data: data,
                borderWidth: 1,
                backgroundColor: generateRandomColor()
            };
        });

        function generateRandomColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return `rgba(${r}, ${g}, ${b}, 1)`;
        }

        if (myChart) {
            myChart.destroy();
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: formData.chartType,
            data: {
                labels: countries,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading or parsing CSV file:', error);
    });
}
