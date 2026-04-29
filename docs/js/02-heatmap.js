// HEATMAP
function updateHeatmap(data, colorScale) {
  const svg = d3.select("#chart-heatmap");
  const margin = { top: 20, right: 20, bottom: 60, left: 100 };
  const width = 850 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const minDate = d3.min(data, d => d.date);
  const maxDate = d3.max(data, d => d.date);
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const heatmapData = [];
  data.forEach(d => {
    const week = d3.timeWeek.count(d3.timeYear(d), d.date);
    const day = d.date.getDay();
    const intensity = d.type === 'rest' ? 0 : (d.intensity === 'high' ? 3 : d.intensity === 'medium' ? 2 : 1);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    heatmapData.push({ 
      week, day, intensity, type: d.type, duration: d.duration, calories: d.calories,
      dayName: `${dayName}, ${d.date.toLocaleDateString()}`, hasWorkout: d.type !== 'rest'
    });
  });

  const cellSize = 30;
  const xScale = d3.scaleLinear().domain([0, d3.max(heatmapData, d => d.week)]).range([0, cellSize * (d3.max(heatmapData, d => d.week) + 1)]);
  const yScale = d3.scaleBand().domain([0,1,2,3,4,5,6]).range([0, cellSize * 7]);

  g.selectAll("rect")
    .data(heatmapData)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.week))
    .attr("y", d => yScale(d.day))
    .attr("width", cellSize - 2)
    .attr("height", cellSize - 2)
    .attr("fill", d => {
      if (d.intensity === 0) return colorScale.rest;
      if (d.intensity === 3) return colorScale.high;
      if (d.intensity === 2) return colorScale.medium;
      return colorScale.low;
    })
    .attr("class", "heatmap-cell")
    .style("cursor", "pointer")
    .on("mouseover", function() { d3.select(this).attr("opacity", 0.8).attr("stroke", "#fff").attr("stroke-width", 2); })
    .on("mouseout", function() { d3.select(this).attr("opacity", 1).attr("stroke", "none"); })
      .on("click", function(event, d) {
        if (!d.hasWorkout) { alert(`No workout on ${d.dayName}`); return; }
      d3.selectAll(".heatmap-detail-tooltip").remove();
      const cellTooltip = d3.select("body").append("div")
        .attr("class", "heatmap-detail-tooltip")
        .style("position", "absolute").style("background", "rgba(20,20,30,0.98)")
        .style("color", "#fff").style("padding", "15px 18px").style("border-radius", "8px")
        .style("font-size", "12px").style("border-left", `4px solid ${colorScale[d.type] || '#999'}`)
        .style("z-index", "2001").style("box-shadow", "0 8px 20px rgba(0,0,0,0.4)")
        .html(`
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">${d.dayName}</div>
          <div>Type: <strong>${d.type.toUpperCase()}</strong></div>
          <div>Duration: <strong>${d.duration} min</strong></div>
          <div>Intensity: <strong>${d.intensity === 3 ? 'HIGH' : d.intensity === 2 ? 'MEDIUM' : 'LOW'}</strong></div>
          <div>Calories: <strong>${d.calories}</strong></div>
          <div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">click elsewhere to close</div>
        `)
        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 50) + "px");
      d3.select("body").on("click", function() { d3.selectAll(".heatmap-detail-tooltip").remove(); });
    });

  g.selectAll(".day-label").data([0,1,2,3,4,5,6]).enter().append("text").attr("class","day-label")
    .attr("x", -10).attr("y", d => yScale(d) + cellSize/2).attr("dy", ".35em").attr("text-anchor","end")
    .attr("font-size","12px").attr("fill","#666").text(d => dayLabels[d]);

  g.selectAll(".week-label").data(Array.from({length: d3.max(heatmapData, d => d.week) + 1}, (_, i) => i)).enter()
    .append("text").attr("class","week-label").attr("x", d => xScale(d) + cellSize/2)
    .attr("y", cellSize * 7 + 15).attr("text-anchor","middle").attr("font-size","11px").attr("fill","#666")
    .text(d => `W${d + 1}`);
}

function enhanceHeatmap() {
  d3.selectAll(".heatmap-cell").style("cursor", "pointer");
}
