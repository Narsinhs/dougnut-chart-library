import chart from "chart.js/dist/chart";
import React, { useRef } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import "./App.css";
import data from "./data.json"
import { addDynamicColor, calculateTotal, htmlLegendPlugin } from "./helper";


addDynamicColor(data);
const total = calculateTotal(data)
function App() {
  const myChart = useRef();
  return (
    <>
      <div className="header">
        <h1 className="title">Pie Chart</h1>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "300px" }}>
          <Doughnut
            ref={myChart}
            data={data}
            plugins={[htmlLegendPlugin]}
            options={{
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  containerID: "js-legend",
                },

                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let legends = myChart.current.legend.legendItems;
                      let chartData = myChart.current._metasets[0]._parsed;
                      let count = 0;
                      for (let i = 0; i < legends.length; i++) {
                        if (!legends[i].hidden) {
                          count += chartData[i];
                        }
                      }
                      let label = context.label || "";
                      let percentage = count === 0 ?
                        ((100 * (context.parsed || 0)) / total).toFixed(2) :
                        ((100 * (context.parsed || 0)) / count).toFixed(2)

                      label += ": " + percentage + "%";
                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div id="js-legend" className="chart-legend"></div>
      </div>
    </>
  );
}

export default App;
