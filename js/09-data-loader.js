// DATA LOADER
let fullData = [];
const colorScale = {
  cardio: '#2E86AB',
  strength: '#A23B72',
  rest: '#C3CAE8',
  low: '#90EE90',
  medium: '#FFD700',
  high: '#FF6B6B'
};

// Load and process data after functions are defined
d3.csv("data/workouts.csv").then(function(data) {
  data.forEach(d => { d.duration = +d.duration; d.calories = +d.calories; d.date = new Date(d.date); });
  data.sort((a,b) => a.date - b.date);
  fullData = data;
  updateVisualization(data);
});
