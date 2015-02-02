function NewNode(nodeList)
{
    var i,
    s,
    g = {
        nodes: [],
        edges: []
    };
   
    nodeList.sort(SortByRank);

    for (i = 0; i < nodeList.length; i++) {

        var nodeRank = nodeList[i].References.length;

        var xPos = nodeRank*20;
        var yPos = i+50;

        g.nodes.push({
            id: nodeList[i].Name,
            label: nodeList[i].Name,
            x: xPos,
            y: yPos,
            size: nodeRank + 5,
            'color': 'rgb('+Math.round(0)+','+
                            Math.round(xPos*5) + ',' +
                            Math.round(256)+')'
        });

        for (j = 0; j < nodeList[i].References.length; j++)
            g.edges.push({
                id: 'e' + nodeList[i].Name + j,
                source: nodeList[i].References[j],
                target: nodeList[i].Name,
                size: Math.random(),
                'color': 'rgb(' + Math.round(0) + ',' +
                                  Math.round(xPos * 5) + ',' +
                                  Math.round(256) + ')'
            });
    }

    // Instantiate sigma:
    s = new sigma({
        graph: g,
        renderer: { container: document.getElementById('ViewContainer'), type: 'canvas' },
        settings: { labelColor: 'node', labelSize: 'fixed', labelThreshold: 5 }
    });

    s.refresh();
}


function SortByRank(a, b)
{
    if (a.References.length <= b.References.length)
        return 1;
    else
        return -1;
}


