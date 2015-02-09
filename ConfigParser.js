/*
    Parses the spring config and extract the object/bean 
    nodes and their references. The spring "flavor" is determined whether there are "object" or "bean" nodes.
    ParseConfig creates a list of nodes and passing them to the viewer function.
*/

var SpringNode =
    {
        Name: "Node",
        References: new Array(0),
        NumReferences: 0
    };

var JAVA_LANG =
    {
        NodeTerm: "bean"
    };

var DOTNET_LANG =
    {
        NodeTerm: "object"
    };

var LangSetup = DOTNET_LANG;
var XmlDoc;


//ParserInterface candidate
function ParseConfig(xml)
{
    var parser = new DOMParser();
    XmlDoc = parser.parseFromString(xml, "text/xml");

    LanguageDetection();
    Parse();
}

function Parse()
{
    var objectIDs = XmlDoc.getElementsByTagName(LangSetup.NodeTerm);
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

    UpdateView(SpringNodeList);
}



function ParseRefNodes(o)
{
    var refNames = new Array(0);
    var references = o.getElementsByTagName("ref");
    for (var j = 0; j < references.length; j++)
    {
        var refName = references[j].getAttribute(LangSetup.NodeTerm);
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}


function ParsePropertyNodes(o)
{
    var refNames = new Array(0);
    var references = o.getElementsByTagName("property");
    for (var j = 0; j < references.length; j++)
    {
        var refName = references[j].getAttribute("ref");
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}

function ParseCtorNodes(o)
{
    var refNames = new Array(0);
    var references = o.getElementsByTagName("constructor-arg");
    for (var j = 0; j < references.length; j++)
    {
        var refName = references[j].getAttribute("ref");
        if (refName != null && refName != "")
            refNames.push(refName);
    }
    return refNames;
}


function LanguageDetection()
{
    LangSetup = DOTNET_LANG;
    try
    {
        var objectIDs = XmlDoc.getElementsByTagName(JAVA_LANG.NodeTerm);
        if (objectIDs != null && objectIDs.length > 0)
            LangSetup = JAVA_LANG;
    }
    catch (e)
    {
    }
}
