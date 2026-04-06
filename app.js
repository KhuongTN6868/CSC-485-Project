d3.csv("data/workouts.csv").then(function(data) {

    console.log("RAW DATA:", data);

    data.forEach(d => {
        d.duration = +d.duration;
    });

    d3.select("#status")
        .html(`<b>Data Loaded Successfully</b><br>Total rows: ${data.length}`);

    const svg1 = d3.select("#chart1");
    const svg2 = d3.select("#chart2");

    
    svg1.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", (d, i) => 20 + i * 18)
        .text(d => `${d.date} | ${d.type} | ${d.duration} min`);

    
    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 50)
        .attr("y", (d, i) => 20 + i * 25)
        .attr("width", d => d.duration * 3)
        .attr("height", 15);

    svg2.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => d.duration * 3 + 60)
        .attr("y", (d, i) => 32 + i * 25)
        .text(d => `${d.duration} min`);

});