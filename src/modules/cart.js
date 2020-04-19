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
    $tickets.append($(`<span>`).text(session.format + " / " + session.language));
    $tickets.append($(`<br>`));
    $tickets.append($(`<span>`).append($(`<b>`).text("Дата та час:")).append(session.begin_date + " " + session.begin_time));

    let $my_places = $(`<div id="my-places">`);
    let sum = 0;
    selected_seats.forEach(s => {
        let $div = $(`<div class="ticket_place p-3">`);
        $div.append($(`<span>`).append($(`<b>`).text("Ряд: ")).append(s.row_num));
        $div.append($(`<span>`).append($(`<b>`).text(" Місце: ")).append(s.seat_num));
        $div.append($(`<span>`).append($(`<b>`).text(" Ціна: ")).append(s.price + " грн"));
        sum += s.price;
        $my_places.append($div);
    });

    $tickets.append($my_places);
    $film.append($tickets);

    window.localStorage.setItem("pay", JSON.stringify(sum));
    window.localStorage.setItem("bonuses", JSON.stringify(bonuses));
    $('#available-bonus').append(bonuses + " грн)");

    $('#sum').append(sum + " грн");

    if (email != null)
        $('#email').attr("value", email);
    if (card_number != null)
        $('#card-num').val(card_number);

    return $film;
};

module.exports = _makeHtml;
