
var SpringNode ={
        Name: "Node",
        References: new Array(0),
        Users: new Array(0)
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
        var references = objectIDs[i].getElementsByTagName("ref");
        var referencesNames = new Array(0);
        for (var j = 0; j < references.length; j++)
        {
            var refName = references[j].getAttribute("object");
            referencesNames.push(refName);
        }
        var SpringNode = { Name: objectIDs[i].id, References: referencesNames };
        SpringNodeList.push(SpringNode);
    }

    NewNode(SpringNodeList);

});



            


