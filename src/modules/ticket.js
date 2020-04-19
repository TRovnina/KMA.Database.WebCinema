//створити картку квитка
let _makeHtml = ({
                     ticket_id,
                     film_name,
                     format,
                     language,
                     date,
                     time,
                     hall_num,
                     row_num,
                     seat_num,
                     price,
                     image
                 }) => {
    let $ticket = $(`<div class="ticket_card card col-xs-12 col-sm-4 col-md-3 data-ticket-id="${ticket_id}">`);
    $ticket.append($(`<span class="film-title">`).text(film_name));
    $ticket.append($(`<hr>`));
    $ticket.append($(`<span align="center">`).text(format));
    $ticket.append($(`<span>`).append($(`<b>`).text("Мова:")).append(language));

    let $t2td1 = $(`<td>`);
    $t2td1.append($(`<b>`).text("Зал:"));
    $t2td1.append($(`<br>`));
    $t2td1.append(hall_num);
    let $t2td2 = $(`<td>`);
    $t2td2.append($(`<b>`).text("Ряд:"));
    $t2td2.append($(`<br>`));
    $t2td2.append(row_num);
    let $t2td3 = $(`<td>`);
    $t2td3.append($(`<b>`).text("Місце:"));
    $t2td3.append($(`<br>`));
    $t2td3.append(seat_num);

    let $table2 = $(`<table>`);
    $table2.append($(`<tr>`).append($t2td1).append($t2td2).append($t2td3));

    let $t1td1 = $(`<td>`);
    $t1td1.append($(`<b>`).text("Дата:"));
    $t1td1.append($(`<br>`));
    $t1td1.append(date);
    let $t1td2 = $(`<td>`);
    $t1td2.append($(`<b>`).text("Час:"));
    $t1td2.append($(`<br>`));
    $t1td2.append(time);

    let $table1 = $(`<table>`);
    $table1.append($(`<tr>`).append($t1td1).append($t1td2));

    $ticket.append($table1);
    $ticket.append($table2);
    $ticket.append($(`<span>`).append($(`<b>`).text("Ціна:")).append(price + " грн"));

    return $ticket;
};

module.exports = _makeHtml;