import '../stylesheets/main.scss';
import '../stylesheets/authorization.scss';
import 'bootstrap';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

//при завантажені сторінки отримати значення фільтрів. та відкрити сторінку з фільмами
$(window).on('load', function () {

    $.ajax({
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
            $.ajax({
                url: 'http://localhost:51891/api/FilmsShort',
                method: 'get',
                dataType: 'json',
                success: function (json) {
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

    $("#content").empty();
    $("#content").append($(`<div id="films_soon" class="container row col-md-12 col-xs-12 col-sm-12">`));

    $.ajax({
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

    let $this = $(this);
    let id = $this.closest('.film_card').data('film-id');
    $("#content").empty();

    $.ajax({
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

    $("#content").empty();
    $("#content").append($(`<div id="bills_block" class="container col-xs-12 col-sm-12 col-md-12">`));

    $.ajax({
        url: 'http://localhost:51891/api/bill',
        method: 'get',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem('token')),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            if (json.length == 0) {
                let $txt = $(`<img src="../images/oops.png" alt="У вас немає квитків">`);
                $('#bills_block').append($txt);
            }else
                json.forEach(bill => $('#bills_block').append(_makeBill(bill)));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });

});

let _makeTicket = require('../modules/ticket');
$(document).on('click', ' .bill_card .film-image, .bill_card .film-title', function () {

    let $this = $(this);
    let id = $this.closest('.bill_card ').data('bill-id');
    $("#content").empty();
    $("#content").append($(`<div id="tickets_block" class="row container">`));


    $.ajax({
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

    let $this = $(this);
    let id = $this.closest('.session-info ').data('session-id');
    $("#content").empty();
    window.localStorage.setItem("session", JSON.stringify(id))
    $.ajax({
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
            $.ajax({
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

    if (email === "")
        alert("Введіть ваш email");
    else if (bonuses && availBonus < sum)
        alert("У вас не вистчає бонусів. сплатіть карткою!");
    else if (card === "" && !bonuses)
        alert("Введіть номер картки!");
    else {
        let obj = {
            "email": email,
            "tickets_id": tickets,
            "price": sum,
            "session_id": session,
            "bonuses": bonuses
        }

        $.ajax({
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
                selected = new Map();
                $("#href_films").click();
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
    $.ajax({
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
            else if (json.role === 'client')
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
        $.ajax({
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


    $('#films').empty();
    let url = 'http://localhost:51891/api/FilmsShort/?yearFrom=' + yearFrom + '&yearTo=' + yearTo + '&durationFrom=' + durationFrom + '&durationTo=' + durationTo + '&ageRestriction=' + ageRestriction + '&language=' + language + '&date=' + date + '&genres=' + genres + '&format=' + format + '&premiere=' + premiere;

    $.ajax({
        url: url,
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

$(document).on('click', '#clear_filters', function () {

    //заповнити фільтри значеннями
    let filters = JSON.parse(window.localStorage.getItem('filters'));
    _addFilters(filters);

    $('#films').empty();
    $.ajax({
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


//////////////////////////////////////////////////////////////////////
// admin functions

let _createFilm = require('../modules/film-editor');
// відкрити шаблон для створення фільму
$(document).on('click', '#ad_film', function () {

    $.ajax({
        url: "view/create-film.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);
            $('#sessions').addClass("invisible");

            $.ajax({
                url: 'http://localhost:51891/api/FilmEdit',
                method: 'get',
                headers: {
                    'Authorization': JSON.parse(window.localStorage.getItem("token")),
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function (json) {
                    _createFilm(json);
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
});


//створення та редагування фільму
$(document).on('click', '#save-film', function () {
    let imdb = $('#fimb').val();
    let name = $('#fname').val();
    let original = $('#foriginal').val();
    let img = $('#fimg').val();
    let video = $('#fvideo').val();
    let description = $('#fdescription').val();
    let year = $('#fyear').val();
    let duration = $('#fduration').val();
    let age = $('#fage').val();
    let begin = $('#fbegin').val();
    let end = $('#fend').val();
    let premier = $('#fpremier').is(":checked");
    let price = $('#fprice').val();
    let notes = $('#fnotes').val();
    let genres = [];
    let checkG = document.getElementsByName('fg');
    checkG.forEach(g => {
        if (g.checked)
            genres.push(g.value);
    });

    let countries = [];
    let checkC = document.getElementsByName('fc');
    checkC.forEach(c => {
        if (c.checked)
            countries.push(c.value);
    });


    let film = JSON.stringify({
        "imdb": imdb,
        "name": name,
        "original_name": original,
        "description": description,
        "created_year": year,
        "duration": duration,
        "age_restriction": age,
        "begin_date": begin,
        "end_date": end,
        "premiere": premier,
        "price": price,
        "image": img,
        "trailer": video,
        "notes": notes,
        "genres": genres,
        "countries": countries,
        "sessions": {}
    });


    let url;
    let method;
    if ($('#fimb').hasClass("edit")) {
        url = 'http://localhost:51891/api/FilmEdit/' + imdb;
        method = 'put';
    } else {
        url = 'http://localhost:51891/api/FilmEdit';
        method = 'post';
    }

    $.ajax({
        url: url,
        method: method,
        data: film,
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            $("#href_logIn").click();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


let _editorFilm = require('../modules/film-editor');
// відкрити шаблон для редагування фільму
$(document).on('click', '.Film-edit', function () {

    let $this = $(this);
    let id = $this.data('film-id');
    window.localStorage.setItem("editID", JSON.stringify(id));
    filmEdit(id);
});

function filmEdit(id) {
    $.ajax({
        url: "view/create-film.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
                url: 'http://localhost:51891/api/FilmEdit/' + id,
                method: 'get',
                headers: {
                    'Authorization': JSON.parse(window.localStorage.getItem("token")),
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function (json) {
                    _editorFilm(json);
                    $('#fimb').attr("disabled", "");
                    $('#fimb').addClass("edit");
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
}


// видалення фільму
$(document).on('click', '.Film-del', function () {

    let $this = $(this);
    let id = $this.data('film-id');


    $.ajax({
        url: 'http://localhost:51891/api/FilmEdit/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            $("#href_logIn").click();
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
    let id = $this.data('session-id');

    if (selected_ses.has(id)) {
        $this.removeClass("selected");
        selected_ses.delete(id);

        if (selected_ses.size == 0)
            $("#delete-ses").attr("disabled", "");
    } else {
        $this.addClass("selected");
        selected_ses.set(id, {"id": id});
        $("#delete-ses").removeAttr("disabled");
    }

});


//видалити сеанси
$(document).on('click', '#delete-ses', function () {
    selected_ses.forEach(s => {
        $.ajax({
            url: 'http://localhost:51891/api/Session/' + s.id,
            method: 'delete',
            headers: {
                'Authorization': JSON.parse(window.localStorage.getItem("token")),
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: function (json) {
                alert(json.operation_code + " " + json.operation_message);
                selected_ses = new Map();
                filmEdit(JSON.parse(window.localStorage.getItem("editID")));
            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    });
});


//додати сеанс
$(document).on('click', '#add-ses', function () {
    let imdb = JSON.parse(window.localStorage.getItem("editID"));
    let hall = $('#fhall').val();
    let date = $('#fday').val();
    let time = $('#ftime').val();
    let language = $('#flang').val();
    let format = $('#fformat').val();

    let newSession = JSON.stringify({
        "session_id": null,
        "film_imdb": imdb,
        "n_hall": hall,
        "begin_date": date,
        "begin_time": time,
        "language": language,
        "format": format,
        "duration": 0,
        "notes": ""
    });

    console.log(newSession);

    $.ajax({
        url: 'http://localhost:51891/api/Session',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: newSession,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            filmEdit(imdb);
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



// показати знижки
let _tableDiscount = require('../modules/table-discount');
$(document).on('click', '#edit_discount', function () {
    getDiscount();
});

function getDiscount(){
    $.ajax({
        url: "view/edit-discount.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
                url: 'http://localhost:51891/api/DiscountsDate',
                method: 'get',
                headers: {
                    'Authorization': JSON.parse(window.localStorage.getItem("token")),
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function (json) {
                    json.forEach(d => $('#table_discount').append(_tableDiscount(d)));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
}


// видалення знижки
$(document).on('click', '.del-d', function () {
    let $this = $(this);
    let date = $this.data('discount-id');

            $.ajax({
                url: 'http://localhost:51891/api/DiscountsDate/' + date,
                method: 'delete',
                headers: {
                    'Authorization': JSON.parse(window.localStorage.getItem("token")),
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: function (json) {
                    alert(json.operation_code + " " + json.operation_message);
                    getDiscount();
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
});


// редагування знижки
$(document).on('click', '.edit-d', function () {
    let $this = $(this);

    let date = $this.data('discount-id');
    let name = $('#'+date+'name').val();
    let price = $('#'+date+'discount').val();

    let discount = JSON.stringify({
        "date_value": date,
        "name": name,
        "discount": price,
        "notes:": null
    });

    $.ajax({
        url: 'http://localhost:51891/api/DiscountsDate/' + date,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: discount,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getDiscount();

        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// створення знижки
$(document).on('click', '#create-d', function () {
    let date = $('#Ddate').val();
    let name = $('#Dname').val();
    let price = $('#Dnum').val();

    let discount = {
        "date_value": date,
        "name": name,
        "discount": price,
        "notes:": null
    };

    $.ajax({
        url: 'http://localhost:51891/api/DiscountsDate',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(discount),
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getDiscount();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// показати жанри
let _tableGenre = require('../modules/table-genre');
$(document).on('click', '#edit_genre', function () {

    getGenres();
});

function getGenres(){
    $.ajax({
        url: "view/edit-genre.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);


            $.ajax({
                url: 'http://localhost:51891/api/Genre',
                method: 'get',
                dataType: 'json',
                success: function (json) {
                    json.forEach(genre => $('#table_genre').append(_tableGenre(genre)));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
}


// створення жанру
$(document).on('click', '#create-g', function () {
    let name = $('#Gname').val();
    let notes = $('#Gdescription').val();

    let genre = {
        "id_genre": null,
        "name": name,
        "notes": notes
    };

    $.ajax({
        url: 'http://localhost:51891/api/genre',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(genre),
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getGenres();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// видалення жанру
$(document).on('click', '.del-g', function () {
    let $this = $(this);
    let id = $this.data('genre-id');

    $.ajax({
        url: 'http://localhost:51891/api/genre/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getGenres();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// редагування жанру
$(document).on('click', '.edit-g', function () {
    let $this = $(this);
    let id = $this.data('genre-id');
    let name = $('#'+id+'name').val();
    let notes = $('#'+id+'notes').val();

    let genre = JSON.stringify({
        "id_genre": id,
        "name": name,
        "notes": notes
    });

    $.ajax({
        url: 'http://localhost:51891/api/genre/' + id,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: genre,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getGenres();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



//показати країни
let _tableCountry = require('../modules/table-country');
$(document).on('click', '#edit_country', function () {

    getCountries();
});


function getCountries(){
    $.ajax({
        url: "view/edit-country.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
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
        }
    });
}


// редагування країни
$(document).on('click', '.edit-c', function () {
    let $this = $(this);
    let id = $this.data('country-id');
    let name = $('#' + id + 'name').val();
    let notes = $('#'+id+'notes').val();

    let country = JSON.stringify({
        "id_country": id,
        "name": name,
        "notes": notes
    });

    console.log(country);

    $.ajax({
        url: 'http://localhost:51891/api/Country/' + id,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: country,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getCountries();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



// видалення країни
$(document).on('click', '.del-c', function () {
    let $this = $(this);
    let id = $this.data('country-id');

    $.ajax({
        url: 'http://localhost:51891/api/Country/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getCountries();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// створення країни
$(document).on('click', '#create-c', function () {
    let id = $('#Cid').val();
    let name = $('#Cname').val();
    let notes = $('#Cdescription').val();

    let country = {
        "id_country": id,
        "name": name,
        "notes": notes
    };


    $.ajax({
        url: 'http://localhost:51891/api/Country',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(country),
        dataType: 'json',
        success: function (json) {
            console.log(json);
            alert(json.operation_code + " " + json.operation_message);
            getCountries();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


//показати формати
let _tableFormat = require('../modules/table-format');
$(document).on('click', '#edit_format', function () {
    getFormats();
});

function getFormats(){
    $.ajax({
        url: "view/edit-format.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
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
        }
    });
}



// створення формату
$(document).on('click', '#create-f', function () {
    let name = $('#Fname').val();
    let number = $('#Fincrease').val();

    let format = {
        "format_id": null,
        "name": name,
        "price_percent": number
    };

    $.ajax({
        url: 'http://localhost:51891/api/format',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(format),
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getFormats();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// редагування формату
$(document).on('click', '.edit-f', function () {
    let $this = $(this);
    let id = $this.data('format-id');
    let name = $('#' + id + 'name').val();
    let number = $('#'+id+'number').val();

    let format = JSON.stringify({
        "format_id": id,
        "name": name,
        "price_percent": number
    });

    $.ajax({
        url: 'http://localhost:51891/api/format/' + id,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: format,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getFormats();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



// видалення формату
$(document).on('click', '.del-f', function () {
    let $this = $(this);
    let id = $this.data('format-id');

    $.ajax({
        url: 'http://localhost:51891/api/format/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getFormats();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});




//показати мови
let _tableLang = require('../modules/table-lang');
$(document).on('click', '#edit_lang', function () {
    getLangs();
});

function getLangs(){
    $.ajax({
        url: "view/edit-lang.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
                url: 'http://localhost:51891/api/Language',
                method: 'get',
                dataType: 'json',
                success: function (json) {
                    json.forEach(l => $('#table_lang').append(_tableLang(l)));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
}


// створення мови
$(document).on('click', '#create-l', function () {
    let id = $('#Lid').val();
    let name = $('#Lname').val();
    let number = $('#Lincrease').val();

    let lang = {
        "language_id": id,
        "name": name,
        "price_percent": number
    };

    $.ajax({
        url: 'http://localhost:51891/api/Language',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(lang),
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getLangs();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// редагування мови
$(document).on('click', '.edit-l', function () {
    let $this = $(this);
    let id = $this.data('lang-id');
    let name = $('#' + id + 'name').val();
    let number = $('#'+id+'number').val();

    let lang = JSON.stringify({
        "language_id": id,
        "name": name,
        "price_percent": number
    });

    $.ajax({
        url: 'http://localhost:51891/api/Language/' + id,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: lang,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getLangs();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



// видалення мови
$(document).on('click', '.del-l', function () {
    let $this = $(this);
    let id = $this.data('lang-id');

    $.ajax({
        url: 'http://localhost:51891/api/Language/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getLangs();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


//показати зали
let _tableHall = require('../modules/table-hall');
$(document).on('click', '#edit_hall', function () {
    getHalls();
});

function getHalls(){
    $.ajax({
        url: "view/edit-halls.html",
        cache: false,
        success: function (html) {
            $("#content").html(html);

            $.ajax({
                url: 'http://localhost:51891/api/hall',
                method: 'get',
                dataType: 'json',
                success: function (json) {
                    json.forEach(h => $('#table_hall').append(_tableHall(h)));
                },
                error: function (xhr) {
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    });
}



// створення зали
$(document).on('click', '#create-h', function () {
    let id = $('#Hname').val();
    let imax = $('#Himax').is(":checked");
    let row = $('#Hrows').val();
    let seat = $('#Hplaces').val();
    let notes = $('#Hdescription').val();


    let hall = {
        "number": id,
        "imax": imax,
        "row_amount": row,
        "seat_row_amount": seat,
        "notes": notes
    };

    $.ajax({
        url: 'http://localhost:51891/api/hall',
        method: 'post',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(hall),
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getHalls();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


// редагування зали
$(document).on('click', '.edit-h', function () {
    let $this = $(this);
    let id = $this.data('hall-id');
    let imax = $('#' + id + 'imax').is(":checked");
    let row = $('#'+id+'row').val();
    let seat = $('#'+id+'seat').val();
    let notes = $('#'+id+'notes').val();


    let hall = JSON.stringify({
        "number": id,
        "imax": imax,
        "row_amount": row,
        "seat_row_amount": seat,
        "notes": notes
    });


    $.ajax({
        url: 'http://localhost:51891/api/hall/' + id,
        method: 'put',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        data: hall,
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getHalls();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});



// видалення формату
$(document).on('click', '.del-h', function () {
    let $this = $(this);
    let id = $this.data('hall-id');

    $.ajax({
        url: 'http://localhost:51891/api/hall/' + id,
        method: 'delete',
        headers: {
            'Authorization': JSON.parse(window.localStorage.getItem("token")),
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (json) {
            alert(json.operation_code + " " + json.operation_message);
            getHalls();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});


