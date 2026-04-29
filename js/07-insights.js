// INSIGHTS
function updateInsights(data, fullData) {
  const workoutData = data.filter(d => d.type !== 'rest');
  const restDays = data.filter(d => d.type === 'rest').length;
  const cardioTotal = d3.sum(data.filter(d => d.type === 'cardio'), d => d.duration);
  const strengthTotal = d3.sum(data.filter(d => d.type === 'strength'), d => d.duration);
  const totalCals = d3.sum(workoutData, d => d.calories);

  const currentYear = fullData.filter(d => d.date.getFullYear() === 2026);
  const previousYear = fullData.filter(d => d.date.getFullYear() === 2025);
  const avgDurationCurrent = currentYear.length > 0 ? d3.mean(currentYear.filter(d => d.type !== 'rest'), d => d.duration) : 0;
  const avgDurationPrevious = previousYear.length > 0 ? d3.mean(previousYear.filter(d => d.type !== 'rest'), d => d.duration) : 0;
  let improvement = 'N/A';
  if (avgDurationPrevious && avgDurationPrevious > 0) {
    improvement = ((avgDurationCurrent - avgDurationPrevious) / avgDurationPrevious * 100).toFixed(0);
  }

  let insights = `
    <p><strong>Real Talk:</strong> so i actually did ${workoutData.length} workouts over 16 months and took ${restDays} rest days. 
    that's like... ${Math.round(workoutData.length / (workoutData.length + restDays) * 100)}% of my time actually being productive.</p>
    
    <p><strong>My Workout Split:</strong> i spent ${cardioTotal} minutes doing cardio and ${strengthTotal} minutes lifting. 
    so basically i'm ${cardioTotal > strengthTotal ? 'more of a cardio person' : 'trying to build strength'}</p>
    
    <p><strong>Calories Burned:</strong> total burned: ${totalCals.toLocaleString()} calories. 
    that's like ${Math.round(totalCals / (workoutData.length || 1))} calories per workout on average. (translation: i've earned the pizza)</p>

    <p><strong>Progress:</strong> ${improvement === 'N/A' ? 'Not enough prior data to compute percentage change.' : `my average workout went from ${avgDurationPrevious.toFixed(0)} min (2025) to ${avgDurationCurrent.toFixed(0)} min (2026) — about ${improvement}% improvement.`}</p>
    
    <p><strong>Bottom Line:</strong> ${restDays === 0 ? 'i basically never rest (that might be a problem)' : 'i actually know how to take rest days which is important.'} The fact that my numbers trend upward shows consistency works.</p>
  `;

  d3.select("#insights-content").html(insights);
}
