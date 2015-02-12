
//ViewInterface candidate
function UpdateView(nodeList)
{
    var g = CreateGraph(nodeList);
    RefreshGraph(g);
}


function RefreshGraph(graph)
{
    document.getElementById('ViewContainer').innerHTML = "";
    var s = new sigma({
        graph: graph,
        renderer: { container: document.getElementById('ViewContainer'), type: 'canvas' },
        settings: { labelColor: 'node', labelSize: 'fixed', labelThreshold: 4 }
    });

    InitNeighboorHood(s);
}

sigma.classes.graph.addMethod('neighbors', function (nodeId)
{
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index)
        neighbors[k] = this.nodesIndex[k];

    return neighbors;
});


function InitNeighboorHood(s)
{
    var backColor = document.getElementById('ViewContainer').style.backgroundColor;
    s.graph.nodes().forEach(function (n)
    {
        n.originalColor = n.color;
        n.originalSize = n.size;
    });

    s.graph.edges().forEach(function (e)
    {
        e.originalColor = e.color;
    });


    s.bind('clickNode', function (e)
    {
        var nodeId = e.data.node.id, toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

        s.graph.nodes().forEach(function (n)
        {
            if (toKeep[n.id]) 
                n.size = 5;
            else
            {
                n.color = "rgba(0, 0, 0, 0)";
                n.size = 2;
            }
        });

        s.graph.edges().forEach(function (e)
        {
            if (!toKeep[e.source] || !toKeep[e.target])
                e.color = "rgba(0, 0, 0, 0)";
        });

        s.refresh();
    });

    s.bind('clickStage', function (e)
    {
        s.graph.nodes().forEach(function (n)
        {
            n.color = n.originalColor;
            n.size = n.originalSize;
        });

        s.graph.edges().forEach(function (e)
        {
            e.color = e.originalColor;
        });
        s.refresh();
    });
}
