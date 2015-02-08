function NewNode(nodeList)
{
    var i,
    s,
    g = {
        nodes: [],
        edges: []
    };
   
    nodeList.sort(SortByRank);
    var maxReferences = nodeList[0].NumReferences;
    var graphLevelMatrix = new Array(maxReferences);

    for (i = 0; i < nodeList.length; i++)
    {
        var node = nodeList[i];
        if (graphLevelMatrix[node.NumReferences] == null)
            graphLevelMatrix[node.NumReferences] = new Array();

        graphLevelMatrix[node.NumReferences].push(node);
    }

    for (var level = 0; level < maxReferences; level++)
    {
        var numLevelNodes = 0;
        if (graphLevelMatrix[level] != null)
            numLevelNodes = graphLevelMatrix[level].length;
        else
            numLevelNodes = 0;

        var xStart = -numLevelNodes / 2;
        for (i = 0; i < numLevelNodes; i++)
        {
            var node = graphLevelMatrix[level][i];
            var nodeName = node.Name;


            var xPos = xStart+i*nodeName.length * 10;
            var yPos = level - 10;

            g.nodes.push({
                id: nodeName,
                label: nodeName,
                x: xPos,
                y: yPos,
                size: level + 5,
                'color': 'rgb(' + Math.round(0) + ',' +
                                  Math.round(yPos * 5) + ',' +
                                  Math.round(256) + ')'
            });

            for (j = 0; j < node.NumReferences; j++)
                g.edges.push({
                    id: 'e' + nodeName + j,
                    source: node.References[j],
                    target: nodeName,
                    size: Math.random(),
                    'color': 'rgb(' + Math.round(0) + ',' +
                                      Math.round(yPos * 5) + ',' +
                                      Math.round(256) + ')'
                });
        }
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
    if (a.NumReferences <= b.NumReferences)
        return 1;
    else
        return -1;
}


