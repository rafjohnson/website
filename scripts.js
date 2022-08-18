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