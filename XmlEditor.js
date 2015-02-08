
var SpringNode ={
        Name: "Node",
        References: new Array(0),
        NumReferences: 0
        };


var _XmlEditor = CodeMirror.fromTextArea(document.getElementById("SpringEditor"),
                    {
                        mode: "application/xml",
                        lineNumbers: true
                    });
            


window.onload = function ()
{
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e)
    {
        var file = fileInput.files[0];
        var textType = "application/xml";


        if (file.type.match(textType))
        {
            var reader = new FileReader();

            reader.onload = function (e)
            {
                fileDisplayArea.innerText = reader.result;
            }

            reader.onloadend = function (e)
            {
                _XmlEditor.setValue(reader.result);
            }
  
            reader.readAsText(file);
        }
        else
        {
            fileDisplayArea.innerText = "File not supported!"
        }
    });
}

_XmlEditor.on("change", function ()
{
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(_XmlEditor.getValue(), "application/xml");

    var objectIDs = xmlDoc.getElementsByTagName("object");
    var SpringNodeList = new Array(0);
    for (var i = 0; i < objectIDs.length; i++)
    {
        var referencesNames = new Array(0);
        var o = objectIDs[i];

        var refNames = ParseRefNodes(o);
        if (refNames.length > 0 && refNames[0] != null)
            referencesNames = referencesNames.concat(refNames);

        var propRefNames = ParsePropertyNodes(o);
        if (propRefNames.length > 0 && propRefNames[0] != null)
            referencesNames = referencesNames.concat(propRefNames);

        var ctorRefNames = ParseCtorNodes(o);
        if (ctorRefNames.length > 0 && ctorRefNames[0] != null)
            referencesNames = referencesNames.concat(ctorRefNames);

        if (o.id != "")
        {
            var SpringNode = { Name: o.id, References: referencesNames, NumReferences: referencesNames.length };
            SpringNodeList.push(SpringNode);
        }
    }

    NewNode(SpringNodeList);

});


function ParseRefNodes(o)
{
    var refNames = new Array(0);
    var references = o.getElementsByTagName("ref");
    for (var j = 0; j < references.length; j++)
    {
        var refName = references[j].getAttribute("object");
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}


function ParsePropertyNodes(o)
{
    var refNames = new Array(0);
    var references = o.getElementsByTagName("property");
    for (var j = 0; j < references.length; j++) {
        var refName = references[j].getAttribute("ref");
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}

function ParseCtorNodes(o) {
    var refNames = new Array(0);
    var references = o.getElementsByTagName("constructor-arg");
    for (var j = 0; j < references.length; j++) {
        var refName = references[j].getAttribute("ref");
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}


