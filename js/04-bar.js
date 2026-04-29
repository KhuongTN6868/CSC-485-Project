// BAR CHART
function updateBarChart(data, colorScale) {
  const svg = d3.select("#chart2");
  const barHeight = 22; const gap = 8; const margin = { top: 20, right: 150, bottom: 20, left: 150 };
  const height = data.length * (barHeight + gap) + margin.top + margin.bottom;
  svg.attr("height", height).attr("width", 950);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const maxDuration = d3.max(data, d => d.duration === 0 ? 10 : d.duration);
  const xScale = d3.scaleLinear().domain([0, maxDuration]).range([0, 700]);

  g.selectAll("rect.workout-bar").data(data).enter().append("rect").attr("class","workout-bar")
    .attr("y", (d,i) => i * (barHeight + gap)).attr("width", d => xScale(d.duration === 0 ? 10 : d.duration))
    .attr("height", barHeight).attr("fill", d => colorScale[d.type]).attr("opacity",0.82).attr("rx",4)
    .style("cursor","pointer").on("mouseover", function(event,d){
      const currentBar = d3.select(this);
      currentBar.attr("opacity",1).attr("stroke","#fff").attr("stroke-width",2.5).style("filter","drop-shadow(0 3px 6px rgba(0,0,0,0.25))");
      const tooltipContent = `\n        <div style="font-weight: bold; margin-bottom: 6px; font-size: 13px;">${d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>\n        <div>Type: <strong>${d.type.toUpperCase()}</strong></div>\n        <div>Duration: <strong>${d.duration} min</strong></div>\n        <div>Intensity: <strong>${d.intensity.toUpperCase()}</strong></div>\n        <div>Calories: <strong>${d.calories}</strong></div>\n        <div>Muscle Group: <strong>${d.muscle_group}</strong></div>\n      `;
      const tooltip = d3.select("body").append("div").attr("class","bar-tooltip").style("position","absolute").style("background","rgba(20,20,30,0.96)")
        .style("color","#fff").style("padding","14px 16px").style("border-radius","8px").style("font-size","12px").style("pointer-events","none")
        .style("z-index","2000").style("border", `3px solid ${colorScale[d.type]}`).style("line-height","1.9").style("box-shadow","0 8px 24px rgba(0,0,0,0.4)")
        .html(tooltipContent).style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 90) + "px");
    }).on("mouseout", function(){ d3.select(this).attr("opacity",0.82).attr("stroke","none").style("filter","none"); d3.selectAll(".bar-tooltip").remove(); });

  g.selectAll("text.date").data(data).enter().append("text").attr("class","date").attr("x", -15)
    .attr("y", (d,i) => i * (barHeight + gap) + barHeight/2).attr("dy", ".35em").attr("text-anchor","end").attr("font-size","11px")
    .attr("fill","#555").attr("font-weight","500").text(d => d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

  g.selectAll("text.label").data(data).enter().append("text").attr("class","label")
    .attr("x", d => xScale(d.duration === 0 ? 10 : d.duration) + 12)
    .attr("y", (d,i) => i * (barHeight + gap) + barHeight/2).attr("dy", ".35em").attr("font-size","12px")
    .attr("font-weight","600").attr("fill", d => colorScale[d.type]).text(d => d.duration === 0 ? "REST" : `${d.duration} min`);

  g.selectAll("text.type").data(data).enter().append("text").attr("class","type")
    .attr("x", d => xScale(d.duration === 0 ? 10 : d.duration) + 12)
    .attr("y", (d,i) => i * (barHeight + gap) + barHeight/2 + 13).attr("font-size","10px").attr("fill","#999")
    .text(d => `${d.intensity}${d.type !== 'rest' ? ' • ' + d.calories + ' cal' : ''}`);
}
