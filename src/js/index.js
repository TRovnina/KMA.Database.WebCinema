import '../stylesheets/main.scss';
import '../stylesheets/authorization.scss';
import 'bootstrap';

import $ from 'jquery';

window.jQuery = $;
window.$ = $;
//window.localStorage.setItem("token", JSON.stringify(""));

//при завантажені сторінки отримати значення фільтрів. та відкрити сторінку з фільмами
$(window).on('load', function () {

    jQuery.ajax({
        url: 'http://localhost:51891/api/filter',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            let filter = JSON.stringify(json);
            window.localStorage.setItem('filters', filter);
            $("#href_films").click();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });


});

let _addFilters = require('../modules/filters');
let _makeFilm = require('../modules/film');

//вивести на екран список фільмів
$(document).on('click', '#href_films', function () {
    $.ajax({
        url: "view/films.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            //заповнити фільтри значеннями
            let filters = JSON.parse(window.localStorage.getItem('filters'));
            _addFilters(filters);


            //заповнити блок фільмами
            jQuery.ajax({
                url: 'http://localhost:51891/api/FilmsShort',
                method: 'get',
                dataType: 'json',
                success: function (json) {
                    console.log(json);
                    $('#films').empty();
                    json.forEach(film => $('#films').append(_makeFilm(film)));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                },
            });
        }
    });
});


//вивести фільми, які скоро будуть в прокаті
let _makeSoonFilm = require('../modules/film-soon');
$(document).on('click', '#href_soon', function () {
    /*$.ajax({
        url: "view/films-soon.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });*/

    $("#content").empty();
    $("#content").append($(`<div id="films_soon" class="container row col-md-12 col-xs-12 col-sm-12">`));

    jQuery.ajax({
        url: 'http://localhost:51891/api/filmsshortsoon',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(film => $('#films_soon').append(_makeSoonFilm(film)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
});


let _openFilm = require('../modules/film-description');
//відкрити опис певного фільму
$(document).on('click', ' .film_card .film-image, .film_card .film-title', function () {

    /* $.ajax({
         url: "view/film_description.html",
         cache: false,
         success: function (html) {
             $("#content").html(html);
         }
     });*/

    let $this = $(this);
    let id = $this.closest('.film_card').data('film-id');
    $("#content").empty();

    jQuery.ajax({
        url: 'http://localhost:51891/api/Film/' + id,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            $("#content").append(_openFilm(json));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });

});


let _makeBill = require('../modules/bill');
$(document).on('click', '#href_tickets', function () {
    /*$.ajax({
        url: "view/myTickets.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });*/
    $("#content").empty();
    $("#content").append($(`<div id="bills_block" class="container col-xs-12 col-sm-12 col-md-12">`));

    jQuery.ajax({
        url: 'http://localhost:51891/api/bill',
        method: 'get',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem('token')),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            console.log(json);
            json.forEach(bill => $('#bills_block').append(_makeBill(bill)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });

});

let _makeTicket = require('../modules/ticket');
$(document).on('click', ' .bill_card .film-image, .bill_card .film-title', function () {
    /*$.ajax({
        url: "view/session-tickets.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });*/

    let $this = $(this);
    let id = $this.closest('.bill_card ').data('bill-id');
    $("#content").empty();
    $("#content").append($(`<div id="tickets_block" class="row container">`));


    jQuery.ajax({
        url: 'http://localhost:51891/api/MyTickets/' + id,
        method: 'get',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem('token')),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            json.forEach(ticket => $('#tickets_block').append(_makeTicket(ticket)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
});


let session_places = new Map();
let _addPlace = require('../modules/place');
$(document).on('click', '.time-btn', function () {
    /*$.ajax({
        url: "view/hall-places.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });*/

    let $this = $(this);
    let id = $this.closest('.session-info ').data('session-id');
    $("#content").empty();
    window.localStorage.setItem("session", JSON.stringify(id))
    jQuery.ajax({
        url: 'http://localhost:51891/api/Tickets/' + id,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            $('#content').append(_addPlace(json));
            parseTickets(json);
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
});

let selected = new Map();
// обрати місце
$(document).on('click', '.place', function () {
    let $this = $(this);
    let id = $this.data('place-id');

    let x = session_places.get(id);
    if (selected.has(id)) {
        $this.removeClass("selected");
        selected.delete(id);
        $('#' + id).remove();

        if (selected.size == 0)
            $("#go-to-buy").attr("disabled", "");
    } else {
        $this.addClass("selected");
        selected.set(id, session_places.get(id));
        $('#selected-places').append($(`<p id="${id}">`).text("Ряд: " + x.row_num + " Місце: " + x.seat_num + " Ціна: " + x.price));
        $("#go-to-buy").removeAttr("disabled");
    }

});


//придбати квитки
let _getCart = require('../modules/cart');
$(document).on('click', '#go-to-buy', function () {

    $.ajax({
        url: "view/sale_form.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            console.log("cart");
            jQuery.ajax({
                url: 'http://localhost:51891/api/Ordering/' + JSON.parse(window.localStorage.getItem('session')),
                method: 'get',
                headers: {
                    'Authorization': JSON.parse(window.localStorage.getItem('token')),
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function (json) {
                    console.log(json);

                    $('#purchase-info').append(_getCart(json, selected));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                },
            });
        }
    });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//сплатити за квитки
$(document).on('click', '#buy-tickets', function () {
    let email = $("#email").val();
    let card = $("#card-num").val();
    let bonuses = $("#bonuses").is(":checked");
    let sum = JSON.parse(window.localStorage.getItem("pay"));
    let session = JSON.parse(window.localStorage.getItem("session"));
    let tickets = new Array();
    let availBonus = JSON.parse(window.localStorage.getItem("bonuses"));
    selected.forEach(t => tickets.push(t.ticket_id));

    if (bonuses && availBonus < sum)
        alert("У вас не вистчає бонусів. сплатіть карткою!");
    else if (card === "" && !bonuses) {
        alert("Введіть номер картки!");
    } else {
        let obj = {
            "email": email,
            "tickets_id": tickets,
            "price": sum,
            "session_id": session,
            "bonuses": bonuses
        }
        console.log(obj);
        jQuery.ajax({
            url: ' http://localhost:51891/api/bill',
            method: 'post',
            headers: {
                'Authorization': JSON.parse(window.localStorage.getItem('token')),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(obj),
            contentType: "application/json",
            dataType: 'json',
            success: function (json) {
                alert(json.operation_code + " " + json.operation_message);
                alert('Дякуємо за купівлю квитків');
            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            },
        });
    }
});


function getAccess() {
    $.ajax({
        url: "view/authorization.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });
}

//увійти у кабінет
$(document).on('click', '#href_logIn', function () {

    jQuery.ajax({
        url: 'http://localhost:51891/api/User',
        method: 'get',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem('token')),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            if (json.role === null || json.info === null)
                getAccess();
            else if (json.role === 'administrator')
                fillAdminPage(json.info);
            else if (json.role === 'user')
                fillSettings(json.info);
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

// зареєструватись
$(document).on('click', '#reg-btn', function () {
    $.ajax({
        url: "view/registration.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });
});


$(document).on('click', '#reg-me', function () {

    let email = $('#reg_form #email').val();
    let pass1 = $('#reg_form #password1').val();
    let pass2 = $('#reg_form #password2').val();
    let name = $('#reg_form #name').val();
    let birthday = $('#reg_form #birthday').val();
    let spam = $('#reg_form #spam').is(":checked");

    if (pass1 != pass2) {
        alert("Перевірте введений пароль");
    } else {

        let user = JSON.stringify({
            "email": email,
            "password": pass1,
            "new_password": null,
            "name": name,
            "birthday": birthday,
            "messages": spam,
            "card_number": null,
            "notes": null,
            "age": 0,
            "bonuses": 0
        });
        console.log(user);

        $.ajax({
            url: 'http://localhost:51891/api/Client',
            method: 'post',
            data: user,
            contentType: "application/json",
            dataType: 'json',
            success: function (json) {
                alert(json.operation_code + " " + json.operation_message);
                getAccess();
                //fillSettings(JSON.parse(user));
            },
            error: function (xhr) {
                alert("Error: " + xhr.status + " " + xhr.statusText);
            },
        });
    }
});


// відправити запит на вхід
$(document).on('click', '#success-btn', function () {
    let data = "grant_type=password&username=" + $('#authorization #email').val() + "&password=" + $('#authorization #password').val();
    $.ajax({
        url: 'http://localhost:51891/token',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            let token = json.token_type + " " + json.access_token;
            console.log(token);
            window.localStorage.setItem("token", JSON.stringify(token));
            $("#href_logIn").click();
        },
        error: function (xhr) {
            alert("Error: " + xhr.status + " " + xhr.statusText);
        },
    });
});


// вийти з кабінету
$(document).on('click', '#exit', function () {
    window.localStorage.setItem("token", JSON.stringify(""));
    $("#href_logIn").click();
});


// змінити особисті дані
$(document).on('click', '#edit', function () {
    let email = $('#settings #email').val();
    let name = $('#settings #name').val();
    let birthday = $('#settings #birthday').val();
    let card = $('#settings #card_number').val();
    let spam = $('#settings #spam').is(":checked");

    let obj = JSON.stringify({
        "email": email,
        "password": null,
        "new_password": null,
        "name": name,
        "birthday": birthday,
        "messages": spam,
        "card_number": card,
        "notes": null,
        "age": 0,
        "bonuses": 0
    });

    console.log(obj);
    $.ajax({
        url: 'http://localhost:51891/api/Client',
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: obj,
        contentType: "application/json",
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            alert("Дані успішно змінені");
        },
        error: function (xhr) {
            alert("Error: " + xhr.status + " " + xhr.statusText);
        },
    });
});


// перейти до блоку зміни пароля
$(document).on('click', '#pass_change', function () {
    $.ajax({
        url: "view/changePassword.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

});


// змінити пароль
$(document).on('click', '#change-password', function () {

    let old = $('#password-form #old-password').val();
    let new1 = $('#password-form #password1').val();
    let new2 = $('#password-form #password2').val();

    if (new1 != new2)
        alert("Перевірте введені дані");
    else {
        jQuery.ajax({
            url: 'http://localhost:51891/api/Client',
            method: 'get',
            headers: {
                'Authorization': JSON.parse(window.localStorage.getItem('token')),
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: function (json) {
                if (json.email != null) {
                    json.password = old;
                    json.new_password = new1;

                    console.log(json);
                    $.ajax({
                        url: 'http://localhost:51891/api/Client',
                        method: 'put',
                        headers: {
                            'Authorization': JSON.parse(window.localStorage.getItem('token')),
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(json),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function (json2) {
                            alert(json.operation_code + " " + json.operation_message);
                            alert("Дані успішно змінені");
                            $("#href_logIn").click();
                        },
                        error: function (xhr) {
                            alert("Error: " + xhr.status + " " + xhr.statusText);
                        },
                    });
                } else {
                    getAccess();
                }
            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    }
});


$(document).on('click', '#use_filters', function () {
    console.log("filter");
    let yearFrom = $('#yearFrom').val();
    let yearTo = $('#yearTo').val();
    let durationFrom = $('#durationFrom').val();
    let durationTo = $('#durationTo').val();
    let ageRestriction = $('#filter-limit').val();
    let language = $('#filter-language').val();
    let format = $('#filter-type').val();
    let date = $('#filter-day').val();
    let premiere = $('#premier').checked;
    let genres = "";
    let checkG = [];
    let checkboxes = document.getElementsByName('genre');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked)
            checkG.push(checkboxes[i].value);
    }
    checkG.forEach(g => genres += g + ",");
    genres = genres.substring(0, genres.length - 1);
    console.log(genres);

    $('#films').empty();
    let url = 'http://localhost:51891/api/FilmsShort/?yearFrom=' + yearFrom + '&yearTo=' + yearTo + '&durationFrom=' + durationFrom + '&durationTo=' + durationTo + '&ageRestriction=' + ageRestriction + '&language=' + language + '&date=' + date + '&genres=' + genres + '&format=' + format + '&premiere=' + premiere;
    console.log(url);
    jQuery.ajax({
        url: url,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.table(json);
            json.forEach(film => $('#films').append(_makeFilm(film)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

$(document).on('click', '#clear_filters', function () {

    //заповнити фільтри значеннями
    let filters = JSON.parse(window.localStorage.getItem('filters'));
    _addFilters(filters);

    $('#films').empty();
    jQuery.ajax({
        url: 'http://localhost:51891/api/FilmsShort/?yearFrom=&yearTo=&durationFrom=&durationTo=&ageRestriction=&language=&date=&genres=&format=&premiere=',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(film => $('#films').append(_makeFilm(film)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

let selected_ses = new Map();
// обрати сеанс для видалення
$(document).on('click', '.time-edit', function () {
    let $this = $(this);
    let id = $this.data('');

    if (selected_ses.has(id)) {
        $this.removeClass("selected");
        selected_ses.delete(id);
        $('#' + id).remove();

        if (selected_ses.size == 0)
            $("#delete-ses").attr("disabled", "");
    } else {
        $this.addClass("selected");
        selected_ses.set(id, "");
        $("#delete-ses").removeAttr("disabled");
    }

});


let _tableGenre = require('../modules/table-genre');
// редагування
$(document).on('click', '#edit_genre', function () {

    $.ajax({
        url: "view/edit-genre.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

    jQuery.ajax({
        url: 'http://localhost:51891/api/Genre',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.table(json);
            json.forEach(genre => $('#table_genre').append(_tableGenre(genre)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


let _tableFormat = require('../modules/table-format');
// редагування
$(document).on('click', '#edit_format', function () {

    $.ajax({
        url: "view/edit-format.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

    jQuery.ajax({
        url: 'http://localhost:51891/api/format',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(format => $('#table_format').append(_tableFormat(format)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


let _tableCountry = require('../modules/table-country');
// редагування
$(document).on('click', '#edit_country', function () {

    $.ajax({
        url: "view/edit-country.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

    jQuery.ajax({
        url: 'http://localhost:51891/api/Country',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            json.forEach(country => $('#table_country').append(_tableCountry(country)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// створити фільм
$(document).on('click', '#ad_film', function () {

    $.ajax({
        url: "view/create-film.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });
});


let _editorFilm = require('../modules/film-editor');
// редагування
$(document).on('click', '.Film-edit', function () {

    let $this = $(this);
    let id = $this.id;


    $.ajax({
        url: "view/create-film.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
        }
    });

    jQuery.ajax({
        url: 'http://localhost:51891/api/FilmEdit/' + id,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            _editorFilm(json);
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


function fillAdminPage(info) {
    $.ajax({
        url: "view/admin.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            let _tableFilm = require('../modules/table-film');
            info.forEach(f => $('#edit_film').append(_tableFilm(f)));
        }
    });
}


function fillSettings({
                          email,
                          password,
                          name,
                          birthday,
                          messages,
                          card_number,
                          notes,
                          age,
                          bonuses
                      }
) {
    $.ajax({
        url: "view/mySettings.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
            $('#settings #email').val(email);
            $('#settings #name').val(name);
            $('#settings #birthday').val(birthday);
            $('#settings #card_number').val(card_number);
            $('#settings #bonuses').text(bonuses);

            if (messages)
                $('#settings #spam').attr("checked", "");

            if (age <= 14)
                $('#settings #card_number').attr("disabled", "");
        }
    });
}


function parseTickets({
                          hall_num,
                          imax,
                          tickets
                      }) {
    tickets.forEach(({
                         row,
                         tickets
                     }) => {
        tickets.forEach(({
                             ticket_id,
                             bill_id,
                             sold_out,
                             session_id,
                             seat_num,
                             vip,
                             discount,
                             price
                         }) => {
            let tick = {
                "ticket_id": ticket_id,
                "bill_id": bill_id,
                "sold_out": sold_out,
                "session_id": session_id,
                "hall_num": hall_num,
                "row_num": row,
                "seat_num": seat_num,
                "vip": vip,
                "discount": discount,
                "price": price
            };
            session_places.set(ticket_id, tick);
        });
    });
}
