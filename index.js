import csvData from "./csv-data.js";
import bblCsvData from "./bbl-csv-data.js";

function drawPlots() {
  const plotXContainer = document.querySelector(`.plot-x-container`);
  const plotYContainer = document.querySelector(`.plot-y-container`);
  const plotZContainer = document.querySelector(`.plot-z-container`);
  const csvTraceX = {
    x: csvData.timestamps,
    y: csvData.x,
    type: "scatter",
  };
  const bblTraceX = {
    x: bblCsvData.timestamps,
    y: bblCsvData.x,
    type: "scatter",
  };
  const csvTraceY = {
    x: csvData.timestamps,
    y: csvData.y,
    type: "scatter",
  };
  const bblTraceY = {
    x: bblCsvData.timestamps,
    y: bblCsvData.y,
    type: "scatter",
  };
  const csvTraceZ = {
    x: csvData.timestamps,
    y: csvData.z,
    type: "scatter",
  };
  const bblTraceZ = {
    x: bblCsvData.timestamps,
    y: bblCsvData.z,
    type: "scatter",
  };
  Plotly.plot(plotXContainer, [csvTraceX, bblTraceX]);
  Plotly.plot(plotYContainer, [csvTraceY, bblTraceY]);
  Plotly.plot(plotZContainer, [csvTraceZ, bblTraceZ]);
}

window.addEventListener("load", (event) => {
  drawPlots();
});
