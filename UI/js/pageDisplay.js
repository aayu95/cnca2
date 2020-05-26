$(document).ready(function() {
    "use strict";
    $('ul.navbar-nav > li').click(function(e) {
        $('ul.navbar-nav > li').removeClass('active');
        $(this).addClass('active');
    });
    $(".nicebox").hide();
    $("#legend").hide();
    $("#map").hide();
    $("#ageB").hide();
    $("#ageS").hide();
    $("#pie").hide();
    $("#line").hide();
    $("#alcoholB").hide();
    $("#alcoholS").hide();
    $("#diseaseB").hide();
    $("#diseaseS").hide();
    $("#nationB").hide();
    $("#nationS").hide();
    $("#healthB").hide();
    $("#healthS").hide();
    $("#incomeB").hide();
    $("#incomeS").hide();
    $("#lifeB").hide();
    $("#lifeS").hide();
    $("#creativeB").hide();
    $("#creativeS").hide();
    $("#mapButton").click(function(e) {
        $("#info").hide();
        $("#legend").show();
        $(".nicebox").show();
        $("#map").show();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#aboutButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").show();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#overallButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").show();
        $("#line").show();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#ageButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").show();
        $("#ageS").show();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#alcoholButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").show();
        $("#alcoholS").show();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#diseaseButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").show();
        $("#diseaseS").show();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#creativeButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").show();
        $("#creativeS").show();
    });
    $("#nationButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").show();
        $("#nationS").show();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#healthButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").show();
        $("#healthS").show();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#incomeButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").show();
        $("#incomeS").show();
        $("#lifeB").hide();
        $("#lifeS").hide();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });
    $("#lifeButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#pie").hide();
        $("#line").hide();
        $("#alcoholB").hide();
        $("#alcoholS").hide();
        $("#diseaseB").hide();
        $("#diseaseS").hide();
        $("#nationB").hide();
        $("#nationS").hide();
        $("#healthB").hide();
        $("#healthS").hide();
        $("#incomeB").hide();
        $("#incomeS").hide();
        $("#lifeB").show();
        $("#lifeS").show();
        $("#creativeB").hide();
        $("#creativeS").hide();
    });

    var ip;
    var port = 30006;
    function doGET(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // The request is done; did it work?
                if (xhr.status == 200) {
                    // ***Yes, use `xhr.responseText` here***
                    callback(xhr.responseText);
                } else {
                    // ***No, tell the callback the call failed***
                    callback(null);
                }
            }
        };
        xhr.open("GET", path, false);
        xhr.send();
    }

    function handleFileData(fileData) {
        if (!fileData) {
            // Show error
            return;
        }
        ip = fileData.split('\n').shift();
        console.log(ip);
        // Use the file data
    }
    // Do the request
    doGET("./current.txt", handleFileData);

    //Create table from datastream
    var id=0;
    (function worker() {
        $.ajax({
            url: 'http://'+ip+':'+port+'/getLatestTweets', 
            success: function(data) {
              var table = '<table border="1" id="tweetData"><thead><tr><th style="padding: 6px; text-align: center">Tweet</th></tr></thead><tbody>';
              for(var i = id; i<data.rows.length; i++){
                table+='<tr><td style="padding: 6px;">';
                table+=data.rows[i].value;
                table+='</td></tr>';
            }
            table+='</tbody></table>';
            $("#dataStream").html(table);
            },
            complete: function() {
              // Schedule the next request when the current one's complete
              setTimeout(worker, 10000);
            }
          });
        })();
});