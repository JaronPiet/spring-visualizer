function NewNode(nodeList) {
    var i,
    s,
    g = {
        nodes: [],
        edges: []
    };
    // Generate a random graph:
    for (i = 0; i < nodeList.length; i++) {
        g.nodes.push({
            id: nodeList[i].Name,
            label: nodeList[i].Name,
            x: Math.random(),
            y: Math.random(),
            size: nodeList[i].References.length + 5,
            color: '#5588ff'
        });

        for (j = 0; j < nodeList[i].References.length; j++)
            g.edges.push({
                id: 'e' + nodeList[i].Name + j,
                source: nodeList[i].References[j],
                target: nodeList[i].Name,
                size: Math.random(),
                color: '#ffffff'
            });
    }

    // Instantiate sigma:
    s = new sigma({
        graph: g,
        renderer: { container: document.getElementById('ViewContainer'), type: 'canvas' },
        settings: { labelColor: 'node', labelSize: 'fixed', labelThreshold: 1 }
    });

    s.refresh();
}


