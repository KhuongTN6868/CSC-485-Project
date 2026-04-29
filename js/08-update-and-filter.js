// FILTER & MAIN UPDATE
function filterData(type) {
  d3.selectAll("button").classed("active", false);
  d3.select(`button[onclick="filterData('${type}')"]`).classed("active", true);

  if (type === "all") updateVisualization(fullData);
  else updateVisualization(fullData.filter(d => d.type === type));
}

function updateVisualization(data) {
  d3.select("#chart1").selectAll("*").remove();
  d3.select("#chart2").selectAll("*").remove();
  d3.select("#chart-heatmap").selectAll("*").remove();
  d3.select("#chart-pie").selectAll("*").remove();
  d3.select("#chart-progress").selectAll("*").remove();

  updateStatistics(data);
  updateHeatmap(data, colorScale);
  updateTimeline(data, colorScale);
  updateBarChart(data, colorScale);
  updatePieChart(data, colorScale);
  updateProgressChart(fullData, colorScale);
  updateInsights(data, fullData);

  setTimeout(() => { addStreakDisplay(fullData); enhanceProgressChart(); enhanceHeatmap(); }, 100);
}
