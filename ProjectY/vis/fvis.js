var width = document.body.clientWidth - 10, height = window.innerHeight - 20;
// Set the the width and the height of the SVG

var color = d3.scale.category10();// using color set including 10 colors
var force = d3.layout.force() // position linked nodes using physical simulation.
            .charge(-20)// set the charge strength (-20)
            .linkDistance(10)// set the link distance.
            .size([width, height]);// set the layout size in x and y.

var svg = d3.select("body").append("svg") // create a svg layout
            .attr("width", width) // set its width
            .attr("height", height) // and height
            .append("g") // create a zoom behavior.
            .call(d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", zoom))
            .append("g"); // the first g can make the zoom behavior work.
            //the second g can let it be dragged smoothly.

svg.append("rect") // append a rect layout for draging the svg layout
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function linkMouseover(d) { // change the class of related nodes and links into '.active'
    svg.selectAll(".link").classed("active", function(p) { return p === d; });
    svg.selectAll(".node circle").classed("active", function(p) { return p === d.source || p === d.target; });
}

function nodeMouseover(d) { // change the class of related nodes and links into '.active'
    svg.selectAll(".link").classed("active", function(p) { return p.source === d || p.target === d; });
    d3.select(this).classed("active", true);
}

// Clear any highlighted nodes or links.
function mouseout() {
    svg.selectAll(".active").classed("active", false);
}

    
// the variable graph has been defined in data.js
d3.json("data.json", function(error, graph) {
    if (error) throw error;
    force
        .nodes(graph.nodes)    // set the node and link data to the simulation
        .links(graph.links)
        .start();

var link = svg.selectAll(".link")
            .data(graph.links)      // set data for a group of links.
            .enter().append("line") // set the type (line) of the links
            .attr("class", "link")  // set the class (style) of the links. 
            .on("mouseover", linkMouseover) // set the mouse over behavior
            .on("mouseout", mouseout); // set the mouse out behavior

var node = svg.selectAll(".node")
            .data(graph.nodes) // set data for a group of nodes.
            .enter().append("circle") // set the type (circle) of the nodes. 
            .attr("class", "node")  // set the class (style) of the nodes. 
            .attr("r", function(d){ return d.value; }) // set the radiuses of the nodes as their values.
            .style("fill", function(d){ return color(d.group); })
            .call(force.drag)   // set the nodes allowing to be dragged.
            .on("mouseover", nodeMouseover) //---
            .on("mouseout", mouseout);  //---

node.append("title").text(function(d){ return d.name; }); // set the titles for each of nodes.

force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
 });
function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function linkMouseover(d) { // change the class of related nodes and links into '.active'
    svg.selectAll(".link").classed("active", function(p) { return p === d; });
    svg.selectAll(".node circle").classed("active", function(p) { return p === d.source || p === d.target; });
}

function nodeMouseover(d) { // change the class of related nodes and links into '.active'
    svg.selectAll(".link").classed("active", function(p) { return p.source === d || p.target === d; });
    d3.select(this).classed("active", true);
}

// Clear any highlighted nodes or links.
function mouseout() {
    svg.selectAll(".active").classed("active", false);
}


});