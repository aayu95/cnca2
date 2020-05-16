$(document).ready(function() {
    "use strict";
    $('ul.navbar-nav > li').click(function(e) {
        $('ul.navbar-nav > li').removeClass('active');
        $(this).addClass('active');
    });
    $(".nicebox").hide();
    $("#legend").hide();
    $("#map").hide();
    $("#barGraph").hide();
    $("#mapButton").click(function(e) {
        $("#about").hide();
        $("#legend").show();
        $(".nicebox").show();
        $("#map").show();
        $("#barGraph").hide();
    });
    $("#aboutButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#about").show();
        $("#barGraph").hide();
    });
    $("#barButton").click(function(e) {
        $("#legend").hide();
        $(".nicebox").hide();
        $("#map").hide();
        $("#about").hide();
        $("#barGraph").show();
    });

    //Create table from datastream
    var data;
    $.getJSON('dummy_stream.json', function(result){
        data=result;
    });
    var id=0;
    
    window.setTimeout(function() {
        var table = '<table border="1" id="tweetData"><thead><tr><th style="padding: 6px;">ID</th><th style="padding: 6px;">Tweet</th><th style="padding: 6px;">Sentiment</th><th style="padding: 6px;">Location</th></tr></thead><tbody>';
        for(var i = id; i<(id+5); i++){
            table+='<tr><td style="padding: 6px;">';
            table+=data[i].id;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].tweet_data;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].sentiment;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].location;
            table+='</td></tr>';
        }
        id+=5;
        table+='</tbody></table>';
        $("#dataStream").html(table);
    }, 10);


    window.setInterval(function() {
        var table = '<table border="1" id="tweetData"><thead><tr><th style="padding: 6px;">ID</th><th style="padding: 6px;">Tweet</th><th style="padding: 6px;">Sentiment</th><th style="padding: 6px;">Location</th></tr></thead><tbody>';
        for(var i = id; i<(id+5); i++){
            table+='<tr><td style="padding: 6px;">';
            table+=data[i].id;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].tweet_data;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].sentiment;
            table+='</td><td style="padding: 6px;">';
            table+=data[i].location;
            table+='</td></tr>';
        }
        id+=5;
        if(id>=15){id=0;}
        table+='</tbody></table>';
        $("#dataStream").html(table);
    }, 5000);

});