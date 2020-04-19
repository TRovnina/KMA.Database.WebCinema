//створити картку квитка
let _makeHtml = ({
                     hall_num,
                     imax,
                     tickets
                 }) => {
    let $hall = $(`<div id="hall">`);
    if (imax)
        $hall.append($(`<span>`).text("imax"));
    $hall.append($(`<h4 class="film-title">`).text("Зал " + hall_num));
    $hall.append($(`<img src="../images/screen.png" alt="screen">`));

    let $block = $(`<div id="places-block" class="container">`);
    tickets.forEach(t => {
        let $row = $(`<div class="places-row">`);
        $row.append($(`<span>`).text(t.row));
        t.tickets.forEach(({
                               ticket_id,
                               bill_id,
                               sold_out,
                               session_id,
                               seat_num,
                               vip,
                               discount,
                               price
                           }) => {

            let $ticket;

            if (sold_out)
                $ticket = $(`<button class="place btn btn-secondary " disabled="" data-place-id="${ticket_id}">`).text(seat_num);
            else
                $ticket = $(`<button class="place btn btn-primary " data-place-id="${ticket_id}">`).text(seat_num);

            if (vip)
                $ticket.addClass("vip");

            $row.append($ticket);
        });
        $block.append($row);
    });

    $hall.append($block);
    $hall.append($(`<div id="selected-places">`));
    $hall.append($(`<button id="go-to-buy" class="btn btn-danger align-content-center" disabled="">`).text("Купити"));

    return $hall;
};

module.exports = _makeHtml;
