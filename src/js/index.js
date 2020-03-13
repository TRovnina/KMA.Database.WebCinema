import '../stylesheets/main.scss';
import '../stylesheets/authorization.scss';
import '../stylesheets/films.scss';
import 'bootstrap';

import $ from 'jquery';

window.jQuery = $;
window.$ = $;


// $(window).on('load', function () {
//     $("#href_films").click();
// });


//вивести на екран список фільмів
$(document).on('click', '#href_films', function () {
    $.ajax({
        url: "view/films.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

    // $("#content").empty();
    // $("#content").append($(`<div id="films">`));
    //let _makeFilm = require('../modules/film');
    // jQuery.ajax({
    //     url: '',
    //     method: 'get',
    //     dataType: 'json',
    //     success: function(json){
    //         console.table(json);
    //         json.forEach(film => $('#films').append(_makeFilm(film)));
    //     },
    //     error: function(xhr){
    //         alert("An error occured: " + xhr.status + " " + xhr.statusText);
    //     },
    // });
});

$(document).on('click', '#href_soon', function () {
    // $("#content").empty();
    // $("#content").append($(`<div id="films">`));
    //let _makeFilm = require('../modules/film');
    // jQuery.ajax({
    //     url: '',
    //     method: 'get',
    //     dataType: 'json',
    //     success: function(json){
    //         console.table(json);
    //         json.forEach(film => $('#films').append(_makeFilm(film)));
    //     },
    //     error: function(xhr){
    //         alert("An error occured: " + xhr.status + " " + xhr.statusText);
    //     },
    // });
});

//відкрити опис певного фільму
$(document).on('click', ' .film_card image, .film_card .film-title', function () {
    let _makeDescription = require('../modules/film-description');
    //
    // var $this = $(this);
    // var id = $this.closest('.film').data('film-id');
    // $("#content").empty();
    // $("#content").append($(`<div class="row" id="film_main">`));
    //
    // jQuery.ajax({
    //     url: 'https://nit.tron.net.ua/api/product/' + id,
    //     method: 'get',
    //     dataType: 'json',
    //     success: function(json){
    //         $("#film_main").append(_makeDescription(json));
    //     },
    //     error: function(xhr){
    //         alert("An error occured: " + xhr.status + " " + xhr.statusText);
    //     },
    // });

});


$(document).on('click', '#href_tickets', function () {
    // $.ajax({
    //     url: "view/myTickets.html",
    //     cache: false,
    //     success: function (html) {
    //         $("#content").html(html);
    //     }
    // });
});

$(document).on('click', '#href_logIn', function () {
    $.ajax({
        url: "view/authorization.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });
});