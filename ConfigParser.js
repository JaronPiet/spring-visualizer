/*
    Parses the spring config and extract the object/bean 
    nodes and their references. The spring "flavor" is determined whether there are "object" or "bean" nodes.
    ParseConfig creates a list of nodes and passing them to the viewer function.
*/

function SpringNode(id, name)
{
    this.id = id;
    this.Name = name;
    this.References = new Array(0);
    this.Targets = new Array(0);
    this.x0 = 0;
    this.y0 = 0;
    this.x = 0;
    this.y = 0;

    this.NumReferences = function() {return this.References.length;}
    this.NumTargets = function() { return this.Targets.length;}
}

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
var SpringNodeList;

//ParserInterface candidate
function ParseConfig(xml)
{
    var parser = new DOMParser();
    XmlDoc = parser.parseFromString(xml, "text/xml");

    SpringNodeList = new Array(0);

    LanguageDetection();
    Parse();
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
        Debug.writeln("Spring Config-Language unsupported!");
    }
}


function Parse()
{
    var objectIDs = XmlDoc.getElementsByTagName(LangSetup.NodeTerm);

    for (var i = 0; i < objectIDs.length; i++)
    {
        var o = objectIDs[i];
        if (o.id != "")
        {
            var snode = new SpringNode(i, o.id);
            SpringNodeList.push(snode);
        }
    }

    for (var i = 0; i < objectIDs.length; i++)
    {
        var o = objectIDs[i];
        if (o.id != "")
        {
            ParseRefNodes(o);
            ParsePropertyNodes(o);
            ParseCtorNodes(o);
        }
    }

    UpdateView(SpringNodeList);
}

function ParseRefNodes(o)
{
    var targetNode = FindName(SpringNodeList, o.id);
    if (targetNode != null)
    {
        var references = o.getElementsByTagName("ref");
        for (var j = 0; j < references.length; j++)
        {
            var refName = references[j].getAttribute(LangSetup.NodeTerm);
            if (refName != null && refName != "")
            {
                var refNode = FindName(SpringNodeList, refName);
                if (refNode != null)
                {
                    refNode.Targets.push(targetNode);
                    targetNode.References.push(refNode);
                }
            }
        }
    }
}

function ParsePropertyNodes(o)
{
    var targetNode = FindName(SpringNodeList, o.id);
    if (targetNode != null)
    {
        var references = o.getElementsByTagName("property");
        for (var j = 0; j < references.length; j++)
        {
            var refName = references[j].getAttribute("ref");
            if (refName != null && refName != "")
            {
                var refNode = FindName(SpringNodeList, refName);
                if (refNode != null)
                {
                    refNode.Targets.push(targetNode);
                    targetNode.References.push(refNode);
                }
            }
        }
    }
}

function ParseCtorNodes(o)
{
    var targetNode = FindName(SpringNodeList, o.id);
    if (targetNode != null)
    {
        var references = o.getElementsByTagName("constructor-arg");
        for (var j = 0; j < references.length; j++)
        {
            var refName = references[j].getAttribute("ref");
            if (refName != null && refName != "")
            {
                var refNode = FindName(SpringNodeList, refName);
                if (refNode != null)
                {
                    refNode.Targets.push(targetNode);
                    targetNode.References.push(refNode);
                }
            }
        }
    }
}

function FindName(array, name)
{
    for (var i = 0; i < array.length; i++)
    {
        if (array[i].Name == name)
            return array[i];
    }
    return null;
}


