//створити рядок з залом у таблиці
let _makeHtml = ({
                     number,
                     imax,
                     row_amount,
                     seat_row_amount,
                     notes,
                     sessions
                 }) => {
    let $hall = $(`<tr>`);
    $hall.append($(`<td>`).append($(`<input type="text" class="form-control" disabled value="${number}">`)));
    let x = number + "imax";
    if(imax)
        $hall.append($(`<td>`).append($(`<input type="checkbox" checked class="form-control" id="${x}">`)));
    else
        $hall.append($(`<td>`).append($(`<input type="checkbox" class="form-control" id="${x}">`)));

    x = number + "row";
    $hall.append($(`<td>`).append($(`<input type="number" class="form-control" id="${x}" value="${row_amount}">`)));
    x = number + "seat";
    $hall.append($(`<td>`).append($(`<input type="number" class="form-control" id="${x}" value="${seat_row_amount}">`)));
    x = number + "notes";
    $hall.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${notes}">`)));

    let $btn1;
    let $btn2;
    if(sessions){
        $btn1 = $(`<button type="button" class="btn btn-info edit-h" disabled data-hall-id="${number}">`).text("Редагуати");
        $btn2 = $(`<button type="button" class="btn btn-info del-h" disabled data-hall-id="${number}">`).text("Видалити");
    }else{
        $btn1 = $(`<button type="button" class="btn btn-info edit-h" data-hall-id="${number}">`).text("Редагуати");
        $btn2 = $(`<button type="button" class="btn btn-info del-h" data-hall-id="${number}">`).text("Видалити");
    }

    $hall.append($(`<td>`).append($btn1));
    $hall.append($(`<td>`).append($btn2));

    return $hall;
};

module.exports = _makeHtml;