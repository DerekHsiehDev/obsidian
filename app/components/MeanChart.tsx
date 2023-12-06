import React from "react";
import { Chart } from "react-google-charts";

const options = {
  title: "Mean Median Variance",
  hAxis: { title: "Day" },
  vAxis: { title: "Value" },
};

const BarChart = ({ data }) => {
  const chartData = [
    ["Day", "Mean", "Median", "Variance"],
    ...Object.entries(data).map(([day, values]) => [
      day,
      typeof values.mean === "number" ? values.mean : 0,
      values.median,
      values.variance,
    ]),
  ];

  console.log(chartData);

  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={options}
      width="100%"
      height="400px"
    />
  );
};

export default BarChart;
