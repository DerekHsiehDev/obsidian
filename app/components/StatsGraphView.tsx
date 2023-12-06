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
};

const StatsGraphView = ({ data }: any) => {


  return (
    <div className="w-full rounded-lg overflow-hidden mr-4">
      <Chart
        chartType="LineChart"
        width="100%"
        data={data}
        options={options}
      />
    </div>
  );
};

export default StatsGraphView;

