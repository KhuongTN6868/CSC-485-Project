// STATISTICS CARDS, STREAK CALCULATOR

function updateStatistics(data) {
  const workoutData = data.filter(d => d.type !== 'rest');
  const totalDuration = d3.sum(workoutData, d => d.duration);
  const avgDuration = workoutData.length > 0 ? Math.round(totalDuration / workoutData.length) : 0;
  
  const typeCounts = d3.rollup(workoutData, v => v.length, d => d.type);
  const mostCommonType = typeCounts.size > 0 
    ? Array.from(typeCounts).reduce((a, b) => b[1] > a[1] ? b : a)[0]
    : "N/A";

  d3.select("#stat-workouts").text(workoutData.length);
  d3.select("#stat-duration").text(totalDuration);
  d3.select("#stat-average").text(avgDuration);
  d3.select("#stat-type").text(mostCommonType.charAt(0).toUpperCase() + mostCommonType.slice(1));
}

function calculateStreak(fullData) {
  if (!fullData || fullData.length === 0) return 0;
  let streak = 0;
  const sorted = [...fullData].sort((a, b) => b.date - a.date);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].type !== 'rest') streak++; else break;
  }
  return streak;
}

function addStreakDisplay(fullData) {
  const statsContainer = d3.select("#stats-container");
  if (statsContainer.select(".stat-card-streak").empty()) {
    const streak = calculateStreak(fullData);
    statsContainer.append("div")
      .attr("class", "stat-card stat-card-streak")
      .html(`
        <h3>Current Streak</h3>
        <p class="stat-value streak-value">${streak}</p>
        <p class="streak-subtitle">consecutive workouts</p>
      `)
      .style("animation", "pulse 0.6s ease-in-out");
  } else {
    statsContainer.select(".stat-card-streak .streak-value").text(calculateStreak(fullData));
  }
}
