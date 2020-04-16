let _makeHtml = ({
                     session,
                     email,
                     bonuses,
                     card_number
                 }, selected_seats) => {
    let $film = $(`<div>`);
    $film.append($(`<img src="${session.image}" alt="poster">`));

    let $tickets = $(`<div class="d-inline-block col-xs-12 col-sm-6 col-md-6">`);
    $tickets.append($(`<span class="film-title">`).text(session.film_name));
    $tickets.append($(`<span>`).text(session.format));
    $tickets.append($(`<span>`).text(session.language));
    $tickets.append($(`<br>`));
    $tickets.append($(`<span>`).append($(`<b>`).text("Дата та час:")).text(session.begin_date + " " + session.begin_time));

    let $my_places = $(`<div id="my-places">`);
    selected_seats.forEach(s => {
        let $div = $(`<div class="ticket_place p-3">`);
        $div.append($(`<span>`).append($(`<b>`).text("Ряд:")).text(s.row_num));
        $div.append($(`<span>`).append($(`<b>`).text("Місце:")).text(s.seat_num));
        $div.append($(`<span>`).append($(`<b>`).text("Ціна:")).text(s.price));

        $my_places.append($div);
    });

    $tickets.append($my_places);
    $film.append($tickets);


    $('#purchase-info .available-bonus').text("(Достпно: " + bonuses + " грн)");
    $('#purchase-info #bonuses').attr("max", bonuses);

    if (email != null)
        $('#purchase-info #email').val(email);
    if (card_number != null)
        $('#purchase-info #card-num').val(card_number);


    return $film;
};

module.exports = _makeHtml;
