//створити рядок зі знижкою у таблиці
let _makeHtml = ({
                     date_value,
                     name,
                     discount,
                     notes
                 }) => {
    let $discount = $(`<tr>`);
    $discount.append($(`<td>`).append($(`<input type="date" class="form-control" disabled value="${date_value}">`)));
    let x = date_value+"name";
    $discount.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${name}">`)));
    x = date_value+"discount";
    $discount.append($(`<td>`).append($(`<input type="number" class="form-control" id="${x}" value="${discount}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-d" data-discount-id="${date_value}">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-d" data-discount-id="${date_value}">`).text("Видалити");

    $discount.append($(`<td>`).append($btn1));
    $discount.append($(`<td>`).append($btn2));

    return $discount;
};

module.exports = _makeHtml;