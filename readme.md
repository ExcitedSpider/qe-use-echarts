# qe-use-echarts

Hook approch to use [Echarts](https://echarts.apache.org/) in react.

Feature:

- Responsive to container size change.
- 0 dependencies (except echarts & react).
- Typescript support.

## Get start

```
npm i qe-use-echarts
```

```js
import { useEcharts } from "qe-use-echarts";

function App() {
  const chartRef = useRef();

  const [chartOption, setChartOption] = useState(randomChartConfig);

  useEcharts({
    renderRootRef: chartRef,
    echartsOption: getChartConfig(),
  });

  return (
    <div className="App">
      <div
        ref={chartRef}
        style={{
          height: "600px",
          width: "800px",
        }}
      ></div>
    </div>
  );
}

export default App;

function getChartConfig() {
  return {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true,
      },
    ],
  };
}
```

## Hook Params

```typescript
{
  /**
   * rendor root element ref
   * 
   * div or canavs
   */
  renderRootRef: React.RefObject<HTMLDivElement | HTMLCanvasElement>;
  /**
   * `setOption` 1st param object
   */
  echartsOption: EChartsOption;
  /**
   * `setOption` 2nd param object
   */
  echartsSetOptionOpt?: any;
  /**
   * echarts event listeners
   */
  on?: {
    [eventName: string]: (...params: any[]) => void;
  };
  debug?: boolean;
  /**
   * responsive container size change
   */
  responsive?: boolean;
  /**
   * size change observer throttle
   */
  responsiveThrottle?: number;
}
```