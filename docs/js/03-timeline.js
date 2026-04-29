// TIMELINE
function updateTimeline(data, colorScale) {
  const svg = d3.select("#chart1");
  const barHeight = 22; const gap = 6; const margin = { top: 20, right: 50, bottom: 20, left: 150 };
  const height = data.length * (barHeight + gap) + margin.top + margin.bottom;
  svg.attr("height", height).attr("width", 900);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll("circle").data(data).enter().append("circle")
    .attr("cx", 0).attr("cy", (d,i) => i * (barHeight + gap) + barHeight/2).attr("r",6)
    .attr("fill", d => colorScale[d.type]).attr("stroke","#fff").attr("stroke-width",2);

  g.append("line").attr("x1",0).attr("y1",barHeight/2).attr("x2",0)
    .attr("y2", data.length * (barHeight + gap) - gap + barHeight/2).attr("stroke","#ddd").attr("stroke-width",2);

  g.selectAll("text").data(data).enter().append("text")
    .attr("x", -15).attr("y", (d,i) => i * (barHeight + gap) + barHeight/2).attr("dy", ".35em")
    .attr("text-anchor","end").attr("font-size","12px").attr("fill","#333")
    .text(d => {
      const dateStr = d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (d.type === 'rest') return `${dateStr} - REST`;
      return `${dateStr} - ${d.type.toUpperCase()}`;
    });

  g.selectAll("text.content").data(data).enter().append("text").attr("class","content")
    .attr("x",20).attr("y", (d,i) => i * (barHeight + gap) + barHeight/2).attr("dy", ".35em")
    .attr("font-size","11px").attr("fill","#666")
    .text(d => d.type === 'rest' ? 'Recovery Day' : `${d.duration} min | ${d.muscle_group} | ${d.calories} cal`);
}
