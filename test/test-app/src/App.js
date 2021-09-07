import { useEcharts } from "qe-use-echarts";
import { useRef, useState } from "react";
import "./App.css";
import Mock from "mockjs";
import { flowRight } from "lodash";

function App() {
  const chartRef = useRef();

  const [chartOption, setChartOption] = useState(randomChartConfig);

  useEcharts({
    renderRootRef: chartRef,
    echartsOption: chartOption,
    responsive: true,
    responsiveThrottle: 16,
    on: {
      mouseover: (args) => {
        console.log("mouseover", args);
      },
    },
  });

  return (
    <div className="App">
      <div
        ref={chartRef}
        style={{
          height: "600px",
          width: "800px",
          resize: "both",
          border: "rgba(0,0,0,0.2) 1px solid",
          overflow: "hidden",
        }}
      ></div>
      <button
        style={{ marginTop: "16px" }}
        onClick={flowRight(setChartOption, randomChartConfig)}
      >
        Random!
      </button>
    </div>
  );
}

export default App;

function randomChartConfig() {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ["蒸发量", "降水量", "平均温度"],
    },
    xAxis: [
      {
        type: "category",
        data: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "水量",
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: "{value} ml",
        },
      },
      {
        type: "value",
        name: "温度",
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
      },
    ],
    series: [
      {
        name: "蒸发量",
        type: "bar",
        data: Mock.mock({
          "data|12": ["@integer(0, 250)"],
        }).data,
      },
      {
        name: "降水量",
        type: "bar",
        data: Mock.mock({
          "data|12": ["@integer(0, 250)"],
        }).data,
      },
      {
        name: "平均温度",
        type: "line",
        yAxisIndex: 1,
        data: Mock.mock({
          "data|12": ["@integer(0, 25)"],
        }).data,
      },
    ],
  };
}
