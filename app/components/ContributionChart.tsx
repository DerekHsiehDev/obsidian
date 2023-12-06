import { Chart } from 'react-google-charts';

function ContributionChart({ data }) {
  const chartData = [
    ['Day of the Week', 'Average Contributions'],
    ...Object.entries(data)
  ];

  return (
    <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={chartData}
      options={{
        title: 'Average Contributions per Day of the Week',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Average Contributions',
          minValue: 0,
        },
        vAxis: {
          title: 'Day of the Week',
        },
      }}
    />
  );
}

export default ContributionChart;
// import React from 'react';
// import { Chart } from 'react-google-charts';

// function ContributionChart({ data }) {
//   // Transformation of the data to suit react-google-charts data format
//   const chartData = [
//     ['Day', 'Mean', 'Median', 'Variance', 'Standard Deviation'],
//     ...Object.keys(data).map(day => [
//       day,
//       data[day].mean,
//       data[day].median,
//       data[day].variance,
//       data[day].stdDeviation,
//     ])
//   ];

//   const options = {
//     title: 'Commit Contributions Statistics',
//     hAxis: { title: 'Day of the Week' },
//     vAxis: { title: 'Contribution Statistics' },
//     seriesType: 'bars',
//     series: { 3: { type: 'line' } }, // Example: make the 4th series a line chart
//   };

//   return (
//     <Chart
//       chartType="ComboChart"
//       width="100%"
//       height="400px"
//       data={chartData}
//       options={options}
//     />
//   );
// }

// export default ContributionChart;