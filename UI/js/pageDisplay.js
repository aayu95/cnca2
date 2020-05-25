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
    $("#alcohol").hide();
    $("#disease").hide();
    $("#creative").hide();
    $("#mapButton").click(function(e) {
        $("#info").hide();
        $("#legend").show();
        $(".nicebox").show();
        $("#map").show();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#alcohol").hide();
        $("#disease").hide();
        $("#creative").hide();
    });
    $("#aboutButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").show();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#alcohol").hide();
        $("#disease").hide();
        $("#creative").hide();
    });
    $("#ageButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").show();
        $("#ageS").show();
        $("#alcohol").hide();
        $("#disease").hide();
        $("#creative").hide();
    });
    $("#alcoholButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#alcohol").show();
        $("#disease").hide();
        $("#creative").hide();
    });
    $("#diseaseButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#alcohol").hide();
        $("#disease").show();
        $("#creative").hide();
    });
    $("#alcoholButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#info").hide();
        $("#ageB").hide();
        $("#ageS").hide();
        $("#alcohol").hide();
        $("#disease").hide();
        $("#creative").show();
    });

    //Create table from datastream
    var id=0;
    (function worker() {
        $.ajax({
            url: 'http://localhost:3000/getLatestTweets', 
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
              setTimeout(worker, 30000);
            }
          });
        })();
});