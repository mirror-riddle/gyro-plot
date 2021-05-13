import csvData from "./csv-data.js";

window.addEventListener("load", () => {
  drawPlots();
});

function drawPlots() {
  const plotXContainer = document.querySelector(`.plot-x-container`);
  const plotYContainer = document.querySelector(`.plot-y-container`);
  const plotZContainer = document.querySelector(`.plot-z-container`);
  const csvTraceX = {
    x: csvData.timestamps,
    y: csvData.x,
    type: "scatter",
  };
  const csvTraceY = {
    x: csvData.timestamps,
    y: csvData.y,
    type: "scatter",
  };
  const csvTraceZ = {
    x: csvData.timestamps,
    y: csvData.z,
    type: "scatter",
  };
  Plotly.plot(plotXContainer, [csvTraceX]);
  Plotly.plot(plotYContainer, [csvTraceY]);
  Plotly.plot(plotZContainer, [csvTraceZ]);
}
