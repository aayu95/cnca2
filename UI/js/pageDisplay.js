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
});