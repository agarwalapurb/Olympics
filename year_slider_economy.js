
// Fetch the CSV file
fetch('archive/MedalTally.csv')
  .then(response => response.text())
  .then(data => {
    // Parse the CSV data
    // console.log("daaataa", data);
    const rows = data.split('\n').slice(1); // Remove the header row
    const medalTallyData = rows.map(row => {
      const values = row.split(',');
      return {
        Year: parseInt(values[1]),
        Country: values[0],
        Gold: parseInt(values[3]),
        Silver: parseInt(values[4]),
        Bronze: parseInt(values[2]),
        total_count: parseInt(values[5])
      };
    });
    // console.log("medaltally", medalTallyData.map(row => row.Year));
    // Use the medalTallyData array
    const olympicYears = Array.from(new Set(medalTallyData.map(row => row.Year))).sort((a, b) => a - b);
    const minYear = olympicYears[0];
    const maxYear = olympicYears[olympicYears.length - 1];
    const stepValue = olympicYears.length > 1 ? olympicYears[1] - olympicYears[0]: 1;

    const yearSlider = document.getElementById('year-slider');
    const selectedYear = document.getElementById('selected-year');
    const yearLabels = document.getElementById('year-labels');

    yearSlider.min = minYear;
    yearSlider.max = maxYear;
    yearSlider.value = minYear;
    yearSlider.step = stepValue;
    // console.log(maxYear);

    selectedYear.textContent = minYear;

    // console.log(olympicYears);

    olympicYears.forEach((year, index) => {
        if (index < olympicYears.length) {
            const label = document.createElement('span');
            label.textContent = year;
            yearLabels.appendChild(label);
        }
    });

    const updateSelectedYear = () => {
        const sliderValue = parseInt(yearSlider.value);
        
        const closestOlympicYear = olympicYears.reduce((prev, curr) =>
          Math.abs(curr - sliderValue) < Math.abs(prev - sliderValue) ? curr : prev
        );
        selectedYear.textContent = closestOlympicYear;
      };
  
      yearSlider.addEventListener('input', updateSelectedYear);
      yearSlider.addEventListener('change', updateSelectedYear);
  })
  .catch(error => console.error('Error:', error));