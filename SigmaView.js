function NewNode(nodeList)
{
    var i,
    s,
    g = {
        nodes: [],
        edges: []
    };
   
    var LabelOffsetFactor = 5.5;

    nodeList.sort(SortByRank);
    var maxReferences = nodeList[0].NumReferences+1;
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

        var widthVC = document.getElementById("ViewContainer").clientWidth;
        var nodeStep = widthVC / (numLevelNodes);

        var xPos = -(nodeStep * (numLevelNodes+1)/ 2);
        var yPos = 0;
        for (i = 0; i < numLevelNodes; i++)
        {
            var node = graphLevelMatrix[level][i];
            var nodeName = node.Name;

            xPos += nodeStep;
            yPos = - level * 100;

            g.nodes.push({
                id: nodeName,
                label: nodeName,
                x: xPos,
                y: yPos,
                size: level + 5,
                'color': 'rgb(' + Math.round(level * 30) + ',' +
                                  Math.round(256) + ',' +
                                  Math.round(level * 30) + ')'
            });

            for (j = 0; j < node.NumReferences; j++)
                g.edges.push({
                    id: 'e' + nodeName + j,
                    source: node.References[j],
                    target: nodeName,
                    size: 0.1,
                    'color': 'rgb(' + Math.round(level * 20) + ',' +
                                      Math.round(level * 50) + ',' +
                                      Math.round(256) + ')'
                });
        }
    }



    // Instantiate sigma:
    s = new sigma({
        graph: g,
        renderer: { container: document.getElementById('ViewContainer'), type: 'canvas' },
        settings: { labelColor: 'node', labelSize: 'fixed', labelThreshold: 4 }
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


