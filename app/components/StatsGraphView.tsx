import { usePriorStore } from "@/stores/priorStore";
import { useEffect } from "react";
import { Chart } from "react-google-charts";

// export const data = [
//   ["Year", "Sales", "Expenses"],
//   ["2004", 1000, 400],
//   ["2005", 1170, 460],
//   ["2006", 660, 1120],
//   ["2007", 1030, 540],
// ];

export const options = {
  title: "GitHub Commits",
  curveType: "function",
  legend: { position: "bottom" },
  series: {
    0: { targetAxisIndex: 0 },
    1: { targetAxisIndex: 0, lineDashStyle: [5, 2] }, // Dashed line for forecast
  },
  vAxes: {
    0: { title: "Commits", viewWindow: { min: 0 } },
    1: { title: "Forecasted Commits", viewWindow: { min: 0 } },
  },
  explorer: {
    actions: ["dragToZoom", "rightClickToReset"],
    axis: "horizontal",
    keepInBounds: true,
    maxZoomIn: 4.0,
  },
};

const StatsGraphView = ({ combinedData }: any) => {
  // Assuming combinedData is properly structured as [Date, Actual Commits, Forecasted Commits]
  console.log(combinedData)
  return (
    <div className="w-full rounded-lg overflow-hidden mr-4">
      <Chart
        chartType="LineChart"
        width="100%"
        data={combinedData}
        options={options}
      />
    </div>
  );
};

// const StatsGraphView = ({ data }: any) => {
//   return (
//     <div className="w-full rounded-lg overflow-hidden mr-4">
//       <Chart chartType="LineChart" width="100%" data={data} options={options} />
//     </div>
//   );
// };

export default StatsGraphView;

