// PIE CHART
function updatePieChart(data, colorScale) {
  const svg = d3.select("#chart-pie");
  const radius = 110;
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const g = svg.append("g").attr("transform", `translate(${width/2},${height/2})`);

  const typeData = d3.rollup(data.filter(d => d.type !== 'rest'), v => d3.sum(v, d => d.duration), d => d.type);
  const total = d3.sum(Array.from(typeData.values()));
  const pieData = Array.from(typeData, ([type, duration]) => ({ type: type.charAt(0).toUpperCase()+type.slice(1), value: duration, percentage: ((duration/total)*100).toFixed(1) }));

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const arcLabel = d3.arc().innerRadius(radius+30).outerRadius(radius+30);

  const arcs = g.selectAll("g").data(pie(pieData)).enter().append("g").attr("class","arc");

  arcs.append("path").attr("d", arc).attr("fill", d => colorScale[d.data.type.toLowerCase()]).attr("opacity",0.85)
    .attr("stroke","#fff").attr("stroke-width",2).style("cursor","pointer")
    .on("mouseover", function(event,d){ d3.select(this).attr("opacity",1).attr("stroke-width",3).style("filter","drop-shadow(0 0 8px rgba(0,0,0,0.3))");
      d3.select("body").append("div").attr("class","pie-tooltip").style("position","absolute").style("background","rgba(0,0,0,0.9)")
        .style("color","#fff").style("padding","12px 16px").style("border-radius","6px").style("font-size","13px").style("pointer-events","none")
        .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").style("z-index","1000").style("white-space","nowrap")
        .text(`${d.data.type}: ${d.data.value} min (${d.data.percentage}%)`);
    }).on("mouseout", function(){ d3.select(this).attr("opacity",0.85).attr("stroke-width",2).style("filter","none"); d3.selectAll(".pie-tooltip").remove(); });

  arcs.append("text").attr("transform", d => `translate(${arc.centroid(d)})`).attr("text-anchor","middle").attr("dy","0.35em")
    .attr("font-size","14px").attr("font-weight","700").attr("fill","#fff").text(d => `${d.data.percentage}%`);

  arcs.append("text").attr("transform", d => `translate(${arcLabel.centroid(d)})`).attr("text-anchor","middle").attr("dy","0.35em")
    .attr("font-size","12px").attr("font-weight","600").attr("fill","#333").text(d => `${d.data.type}`);

  arcs.append("text").attr("transform", d => `translate(${arcLabel.centroid(d)})`).attr("text-anchor","middle").attr("dy","1.5em")
    .attr("font-size","11px").attr("fill","#666").text(d => `${d.data.value} min`);
}
