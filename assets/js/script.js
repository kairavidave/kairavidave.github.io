// Set up SVG canvas
const width = document.getElementById('visualization').offsetWidth;
const height = 500;

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Set up color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create simulation
const simulation = d3.forceSimulation(data)
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => d.value * 2))
    .on("tick", ticked);

// Create circles
const nodes = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", d => d.value)
    .attr("fill", (d, i) => color(i))
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

// Add labels to the bubbles
const labels = svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("font-size", "12px")
    .attr("fill", "#fff")
    .attr("text-anchor", "middle");

// Update positions on tick
function ticked() {
    nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labels
        .attr("x", d => d.x)
        .attr("y", d => d.y + 4);
}

// Dragging functions
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
