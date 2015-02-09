
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

    s.refresh();
}
