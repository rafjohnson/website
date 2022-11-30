//all page load, all common onLoads. 
function allPageLoad()
{
    fixFooterHeight();
    getLastModified();

}
//any special page loads
function ProjectPageLoad()
{
    allPageLoad();
    loadGitHubTable();
   
}
function NestPageLoad()
{
    getCurrentTemperature();
    writeCurrentTemp();
    writeFreezing();
}

//global variables
var G_tempInC;
var G_TimeTempUpdated;

function loadGitHubTable()
{
    const xhttp = new XMLHttpRequest();

    xhttp.onload=function(){
        var response = this.responseText;
        //parse json
        var JObj = JSON.parse(response);
        

        //build table. 
        
        //create table open tag
        var htmlTable = "";
        htmlTable += "<table>";
        //add table headers
        htmlTable += "<tr><th>Project Name</th><th>Language</th><th>Created</th><th>Last Updated</th><th>Availability</th></tr>";
        
        //loop arournd the Jobj, adding rows.

        
        for(let i=0;i<JObj.length;i++)
        {
             //add tr tag
            htmlTable +="<tr>";

            //name - is also a link
            htmlTable+="<td>";
            var link = "<a target=\"blank\" href=\""+JObj[i]["html_url"]+"\"a>"+JObj[i]["name"]+"</a>";
            htmlTable +=link;
            htmlTable+="</td>";

            //language
            htmlTable+="<td>";
            htmlTable+=JObj[i]["language"];
            htmlTable+="</td>";

            //created
            htmlTable+="<td>";
            var createdDTStr = JObj[i]["created_at"];
            var createdDate = new Date(createdDTStr);
            htmlTable+=createdDate.toLocaleDateString("en-US");
            htmlTable+="</td>";

            //last updated
            htmlTable+="<td>";
            var updatedDTStr = JObj[i]["pushed_at"];
            var updatedDate = new Date(updatedDTStr);
            htmlTable+=updatedDate.toLocaleDateString("en-US");
            htmlTable+="</td>";

            //availability
            htmlTable+="<td>";
            htmlTable+=JObj[i]["visibility"];
            htmlTable+="</td>";

            //close tr
            htmlTable +="</tr>";
        }

        //close tag
        htmlTable += "</table>"

        document.getElementById("githubTable").innerHTML=htmlTable;
    }
    xhttp.open("GET","https://api.github.com/users/rafjohnson/repos",true)
    xhttp.setRequestHeader("accept","application/vnd.github+json");
    xhttp.send();
}

function getCurrentTemperature()
{
    //44.69794771753228, -73.12395138237159

    
    //build URL:
    var URL = "https://api.openweathermap.org/data/2.5/weather?lat=44.69&lon=-73.12&appid=5cce785d90f7af4ce1bb4a32c3dda15a&units=metric"

    var http = new XMLHttpRequest();
    http.open("GET", URL, false);
    
    
    http.setRequestHeader("accept","application/vnd.github+json");
    http.send();
    
    var response = http.responseText;
    //parse json
    var JObj = JSON.parse(response);

    var tempInC = JObj["main"]["temp"];

    G_tempInC= tempInC;
    G_TimeTempUpdated = UNIXtoUTC(JObj["dt"])




}
function UNIXtoUTC(UNIXTime)
{
    //https://stackoverflow.com/a/847196/7858537
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(UNIXTime * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
    return formattedTime;
}

function writeCurrentTemp()
{
    document.getElementById("currTemp").innerText=G_tempInC;
    document.getElementById("UpdatedTime").innerText=G_TimeTempUpdated;
}
function writeFreezing()
{
    var tempInC = G_tempInC;
    if(tempInC>0)
    {
        document.getElementById("freezing").innerText = "Above Freezing";
        document.getElementById("freezing").style.color="red";
    }
    else{
        document.getElementById("freezing").innerText = "Below Freezing";
        document.getElementById("freezing").style.color="blue";
    }
}

function getLastModified()
{
    //single place for the last modified date
    var lastModified = "2022-08-09";
    document.getElementById("lastModified").innerText=lastModified;

}
function fixFooterHeight()
{
    var sidebar= document.querySelector('.sidebar');
    var content = document.querySelector('.content');
    var sidebarHeight = sidebar.offsetHeight;
    var contentHeight = content.offsetHeight;
    if(contentHeight<sidebarHeight)
    {
        //make content height the same as sidebar height
        //single content div, luckily, so shouldn't need to iterate, but we will anyways
        var contents = document.getElementsByClassName("content");
        for (var i=0; i<contents.length;i++ )
        {
            contents[i].style.height=sidebarHeight;
        }

    }
}
