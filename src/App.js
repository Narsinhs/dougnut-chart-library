import chart from "chart.js/dist/chart";
import React, { useRef } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import "./App.css";
import data from "./data.json"
const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector("ul");

  if (!listContainer) {
    listContainer = document.createElement("ul");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "column";
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};
const htmlLegendPlugin = {
  id: "htmlLegend",
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";
      li.style.marginBottom = "5px";
      let legendItems = chart.legend.legendItems;
      let count = 0;
      let iValue = -1;
      for (let i = 0; i < legendItems.length; i++) {
        // legendItems.
        if (!legendItems[i].hidden) {
          count = count + 1;
          iValue = i;
        }
      }
      let firstTime = count === legendItems.length ? true : false;
      li.onclick = (p, p2, p3) => {

        const { type } = chart.config;
        if (type === "pie" || type === "doughnut") {

          for (let i = 0; i < legendItems.length; i++) {
            if (firstTime) {
              if (i !== item.index) {
                chart.toggleDataVisibility(i);
              }
            }
          }
          if (!firstTime) {
            chart.toggleDataVisibility(item.index);
          }
          if (count === 1 && iValue === item.index) {
            for (let i = 0; i < legendItems.length; i++) {
              chart.toggleDataVisibility(i);
            }
          }

        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

      // Text
      const textContainer = document.createElement("p");
      textContainer.style.color = item.fontColor;
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.textDecoration = firstTime ? item.hidden ? "line-through" : "" : item.hidden ? "" : "line-through";

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};
const dynamicColors = function () {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

data.labels.forEach(() =>
  data.datasets[0].backgroundColor.push(dynamicColors())
);

const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

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
