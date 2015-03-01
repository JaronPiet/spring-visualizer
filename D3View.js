var margin = { top: 20, right: 120, bottom: 20, left: 120 },
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

var svg = d3.select("ViewContainer").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.select(self.frameElement).style("height", "800px");


//ViewInterface candidate
function UpdateView(nodeList)
{
    BuildD3List(nodeList);
}

function BuildD3List (nodeList)
{
    nodeList.sort(SortByInfluence);

    root = nodeList[0];
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d)
    {
        if (d.References)
        {
            d._References = d.References;
            d._References.forEach(collapse);
            d.References = null;
        }
    }

    root.References.forEach(collapse);
    update(root);
}

function SortByInfluence(a, b)
{
    if (a.NumReferences() <= b.NumReferences())
        return 1;
    else
        return -1;
}


function update(source)
{

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.NumReferences() * 180; });

    // Update the nodes�
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._References ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function (d) { return d.References || d._References ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.References || d._References ? "end" : "start"; })
        .text(function (d) { return d.Name; })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function (d) { return d._References ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links�
    var link = svg.selectAll("path.link")
        .data(links, function (d)
        {
            if(d.Targets.length > 0)
                return d.Targets[0].id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d)
        {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d)
        {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d)
    {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d)
{
    if (d.References)
    {
        d._References = d.References;
        d.References = null;
    } else
    {
        d.References = d._References;
        d._References = null;
    }
    update(d);
}
