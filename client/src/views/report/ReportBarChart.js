import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const backgroundColor = [
  // "rgba(255, 99, 132, 0.2)",
  // "rgba(54, 162, 235, 0.2)",
  // "rgba(255, 206, 86, 0.2)",
  // "rgba(75, 192, 192, 0.2)",
  // "rgba(153, 102, 255, 0.2)",
  // "rgba(255, 159, 64, 0.2)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

const options = {
  // responsive 속성을 false로 지정한다.
  responsive: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const ReportBarChart = (props) => {
  const { data } = props;
  const [chart, setChart] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: backgroundColor,
        borderWidth: 2,
        hoverBorderWidth: 3,
        maxBarThickness: 70,
      },
    ],
  });

  useEffect(() => {
    //console.log(data);
    //
    let tempName = [];
    let tempCount = [];
    for (var i = 0; i < data.length; i++) {
      tempName.push(data[i].name);
      tempCount.push(data[i].count);
    }
    setChart({
      labels: tempName,
      datasets: [
        {
          label: "",
          data: tempCount,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    });
  }, [data]);
  return (
    <div className="pie">
      <h4>제보된 생물 </h4>
      <Bar data={chart} width={1100} height={330} options={options} />
    </div>
  );
};

export default ReportBarChart;
