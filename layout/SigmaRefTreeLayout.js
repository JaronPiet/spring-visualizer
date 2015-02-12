
//LayoutInterface candidate
function CreateGraph(nodeList)
{
    var g =
    {
        nodes: [],
        edges: []
    };

    nodeList.sort(SortByInfluence);

    var maxReferences = nodeList[0].NumReferences + 1;
    var levelColorStep = 256 / maxReferences;


    var graphLevelMatrix = CreateGraphLevelMatrix(nodeList, maxReferences);

    for (var level = 0; level < maxReferences; level++)
    {
        var numLevelNodes = CalculateNumLevelNodes(graphLevelMatrix, level);
        var nodeStep = CalculateNodeXStep(numLevelNodes);

        var xPos = -(nodeStep * (numLevelNodes + 1) / 2);
        var yPos = 0;
        for (i = 0; i < numLevelNodes; i++)
        {
            var node = graphLevelMatrix[level][i];
            var nodeName = node.Name;

            xPos += nodeStep;
            yPos = -level * 100;

            g.nodes.push({
                id: nodeName,
                label: nodeName,
                x: xPos,
                y: yPos,
                size: level + 5,
                'color': 'rgb(' + Math.round((level + 1) * levelColorStep) + ',' +
                                  Math.round(256) + ',' +
                                  Math.round((level + 1) * levelColorStep) + ')'
            });

            for (j = 0; j < node.NumReferences; j++)
                g.edges.push({
                    id: 'e' + nodeName + j,
                    source: node.References[j],
                    target: nodeName,
                    type: "arrow",
                    arrow: "target",
                    size: 50,
                    'color': 'rgb(' + Math.round((level + 1) * levelColorStep) + ',' +
                                      Math.round((level + 1) * levelColorStep) + ',' +
                                      Math.round(256) + ')'
                });
        }
    }

    return g;
}


function CreateGraphLevelMatrix(nodeList, maxReferences)
{
    var graphLevelMatrix = new Array(maxReferences);
    for (i = 0; i < nodeList.length; i++)
    {
        var node = nodeList[i];
        if (graphLevelMatrix[node.NumReferences] == null)
            graphLevelMatrix[node.NumReferences] = new Array();

        graphLevelMatrix[node.NumReferences].push(node);
    }

    return graphLevelMatrix;
}

function CalculateNumLevelNodes(graphLevelMatrix, level)
{
    var numLevelNodes = 0;
    if (graphLevelMatrix[level] != null)
        numLevelNodes = graphLevelMatrix[level].length;

    return numLevelNodes;
}

function CalculateNodeXStep(numLevelNodes)
{
    var widthVC = document.getElementById("ViewContainer").clientWidth;
    return widthVC / (numLevelNodes);
}


function SortByInfluence(a, b)
{
    if (a.NumReferences <= b.NumReferences)
        return 1;
    else
        return -1;
}


