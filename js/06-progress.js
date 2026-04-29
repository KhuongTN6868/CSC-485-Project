// PROGRESS OVER TIME
function updateProgressChart(data, colorScale) {
  const svg = d3.select("#chart-progress");
  const margin = { top: 20, right: 40, bottom: 60, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  function showMetricTooltip(event, d, title, fillColor) {
    d3.selectAll(".progress-tooltip, .progress-tooltip-click").remove();
    const tooltip = d3.select("body").append("div").attr("class", "progress-tooltip").style("position", "absolute")
      .style("background", fillColor).style("color", "#fff").style("padding", "12px 16px").style("border-radius", "8px")
      .style("font-size", "12px").style("pointer-events", "none").style("z-index", "2000")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)")
      .html(`<div style="font-weight: bold; margin-bottom: 6px;">${d.month}</div><div>${title}: <strong>${title === 'Avg Duration' ? `${d.avgDuration.toFixed(0)} min` : d.avgCalories.toFixed(0)}</strong></div><div>Workouts: <strong>${d.count}</strong></div><div style="margin-top:6px; font-size:11px; opacity:0.8;">hover points for details</div>`)
      .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 60) + "px");
    return tooltip;
  }

  const monthlyData = d3.rollup(data, v => ({ duration: d3.mean(v, d => d.type !== 'rest' ? d.duration : 0), calories: d3.mean(v, d => d.type !== 'rest' ? d.calories : 0), count: v.filter(d => d.type !== 'rest').length }), d => d3.timeFormat("%Y-%m")(d.date));

  const progressData = Array.from(monthlyData, ([month, stats]) => ({ month, date: new Date(month + "-01"), avgDuration: stats.duration, avgCalories: stats.calories, count: stats.count })).sort((a,b) => a.date - b.date);

  const xScale = d3.scaleTime().domain(d3.extent(progressData, d => d.date)).range([0, width]);
  const yScaleDuration = d3.scaleLinear().domain([0, d3.max(progressData, d => d.avgDuration) * 1.1]).range([height, 0]);
  const yScaleCalories = d3.scaleLinear().domain([0, d3.max(progressData, d => d.avgCalories) * 1.1]).range([height, 0]);

  const lineDuration = d3.line().x(d => xScale(d.date)).y(d => yScaleDuration(d.avgDuration));
  const lineCalories = d3.line().x(d => xScale(d.date)).y(d => yScaleCalories(d.avgCalories));
  const areaDuration = d3.area().x(d => xScale(d.date)).y0(height).y1(d => yScaleDuration(d.avgDuration));
  const areaCalories = d3.area().x(d => xScale(d.date)).y0(height).y1(d => yScaleCalories(d.avgCalories));

  g.append("path").datum(progressData).attr("fill","#2E86AB").attr("opacity",0.15).attr("d", areaDuration);
  g.append("path").datum(progressData).attr("fill","#A23B72").attr("opacity",0.15).attr("d", areaCalories);
  g.append("path").datum(progressData).attr("fill","none").attr("stroke","#2E86AB").attr("stroke-width",3).attr("d", lineDuration);
  g.append("path").datum(progressData).attr("fill","none").attr("stroke","#A23B72").attr("stroke-width",3).attr("d", lineCalories);

  g.selectAll("circle.duration").data(progressData).enter().append("circle").attr("class","duration progress-circle")
    .attr("cx", d => xScale(d.date)).attr("cy", d => yScaleDuration(d.avgDuration)).attr("r",5).attr("fill","#2E86AB").attr("stroke","#fff").attr("stroke-width",2)
    .style("cursor","pointer")
    .on("mouseover", function(event,d){ d3.select(this).attr("r",7).style("filter","drop-shadow(0 2px 4px rgba(0,0,0,0.3))");
      showMetricTooltip(event, d, "Avg Duration", "rgba(46, 134, 171, 0.95)");
    })
    .on("mouseout", function(){ d3.select(this).attr("r",5).style("filter","none"); d3.selectAll(".progress-tooltip").remove(); })
    .on("click", function(event,d){ event.stopPropagation(); d3.selectAll(".progress-tooltip").remove();
      const monthName = d.month; const durationText = d.avgDuration.toFixed(1); const caloriesText = d.avgCalories.toFixed(0);
      const tooltip = d3.select("body").append("div").attr("class","progress-tooltip-click").style("position","absolute")
        .style("background","linear-gradient(135deg, #667eea 0%, #764ba2 100%)").style("color","#fff").style("padding","18px 22px").style("border-radius","10px")
        .style("font-size","13px").style("pointer-events","auto").style("z-index","2001").style("box-shadow","0 10px 30px rgba(0,0,0,0.3)")
        .html(`<div style="font-weight:bold; margin-bottom:10px; font-size:14px;">${monthName}</div><div>Avg Duration: <strong>${durationText} min</strong></div><div>Avg Calories: <strong>${caloriesText}</strong></div><div>Total Workouts: <strong>${d.count}</strong></div><div style="margin-top:8px; font-size:12px; opacity:0.9; border-top:1px solid rgba(255,255,255,0.3); padding-top:8px;">click elsewhere to close</div>`)
        .style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 120) + "px");
      d3.select("body").on("click", function(){ d3.selectAll(".progress-tooltip-click").remove(); });
    });

  g.selectAll("circle.calories").data(progressData).enter().append("circle").attr("class", "calories progress-circle")
    .attr("cx", d => xScale(d.date)).attr("cy", d => yScaleCalories(d.avgCalories)).attr("r",5).attr("fill","#A23B72").attr("stroke","#fff").attr("stroke-width",2)
    .style("cursor","pointer")
    .on("mouseover", function(event,d){ d3.select(this).attr("r",7).style("filter","drop-shadow(0 2px 4px rgba(0,0,0,0.3))");
      showMetricTooltip(event, d, "Avg Calories", "rgba(162, 59, 114, 0.95)");
    })
    .on("mouseout", function(){ d3.select(this).attr("r",5).style("filter","none"); d3.selectAll(".progress-tooltip").remove(); })
    .on("click", function(event,d){ event.stopPropagation(); d3.selectAll(".progress-tooltip").remove();
      const monthName = d.month; const durationText = d.avgDuration.toFixed(1); const caloriesText = d.avgCalories.toFixed(0);
      const tooltip = d3.select("body").append("div").attr("class","progress-tooltip-click").style("position","absolute")
        .style("background","linear-gradient(135deg, #667eea 0%, #764ba2 100%)").style("color","#fff").style("padding","18px 22px").style("border-radius","10px")
        .style("font-size","13px").style("pointer-events","auto").style("z-index","2001").style("box-shadow","0 10px 30px rgba(0,0,0,0.3)")
        .html(`<div style="font-weight:bold; margin-bottom:10px; font-size:14px;">${monthName}</div><div>Avg Duration: <strong>${durationText} min</strong></div><div>Avg Calories: <strong>${caloriesText}</strong></div><div>Total Workouts: <strong>${d.count}</strong></div><div style="margin-top:8px; font-size:12px; opacity:0.9; border-top:1px solid rgba(255,255,255,0.3); padding-top:8px;">click elsewhere to close</div>`)
        .style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 120) + "px");
      d3.select("body").on("click", function(){ d3.selectAll(".progress-tooltip-click").remove(); });
    });

  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b '%y"))).style("font-size","11px");
  g.append("text").attr("transform", `translate(${width/2},${height + 40})`).attr("text-anchor","middle").attr("font-size","12px").attr("fill","#666").attr("font-weight","600").text("Month");
  g.append("g").call(d3.axisLeft(yScaleDuration)).style("font-size","11px");
  g.append("text").attr("transform","rotate(-90)").attr("y",0 - margin.left).attr("x",0 - (height/2)).attr("dy","1em").attr("text-anchor","middle").attr("font-size","12px").attr("fill","#2E86AB").attr("font-weight","600").text("Avg Duration (min)");
  g.append("g").attr("transform", `translate(${width},0)`).call(d3.axisRight(yScaleCalories)).style("font-size","11px");
  g.append("text").attr("transform","rotate(90)").attr("y", width + margin.right).attr("x", height/2).attr("dy","-1em").attr("text-anchor","middle").attr("font-size","12px").attr("fill","#A23B72").attr("font-weight","600").text("Avg Calories Burned");

  const legend = g.append("g").attr("class","legend").attr("transform", `translate(${width - 200},0)`);
  legend.append("circle").attr("cx",0).attr("cy",0).attr("r",4).attr("fill","#2E86AB");
  legend.append("text").attr("x",12).attr("y",0).attr("dy",".35em").attr("font-size","11px").attr("fill","#333").text("Avg Duration");
  legend.append("circle").attr("cx",0).attr("cy",20).attr("r",4).attr("fill","#A23B72");
  legend.append("text").attr("x",12).attr("y",20).attr("dy",".35em").attr("font-size","11px").attr("fill","#333").text("Avg Calories");
}

function enhanceProgressChart() { d3.selectAll(".progress-circle").style("cursor","pointer"); }
