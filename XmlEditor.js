/* 
    Creates a CodeMirror-Editor and set the XML-Mode
    Files can be uploaded.

    Any change of the content calls the ConfigParser to update the graph.
*/

var XmlEditor = CodeMirror.fromTextArea(document.getElementById("SpringEditor"),
                    {
                        mode: "xml",
                        lineNumbers: true
                    });
            


window.onload = function ()
{
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e)
    {
        var file = fileInput.files[0];
        var textType = "xml";


        if (file.type.match(textType))
        {
            var reader = new FileReader();

            reader.onload = function (e)
            {
                fileDisplayArea.innerText = reader.result;
            }

            reader.onloadend = function (e)
            {
                XmlEditor.setValue(reader.result);
            }
  
            reader.readAsText(file);
        }
        else
        {
            fileDisplayArea.innerText = "File not supported!"
        }
    });
}

XmlEditor.on("change", function ()
{
    ParseConfig(XmlEditor.getValue());
});





