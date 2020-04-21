//створити рядок з форматом у таблиці
let _makeHtml = ({
                     format_id,
                     name,
                     price_percent
                 }) => {
    let $format = $(`<tr>`);
    let x = format_id +"name";
    $format.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${name}">`)));
    x= format_id + "number";
    $format.append($(`<td>`).append($(`<input type="number" class="form-control" id="${x}" value="${price_percent}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-f" data-format-id="${format_id}">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-f" data-format-id="${format_id}">`).text("Видалити");

    $format.append($(`<td>`).append($btn1));
    $format.append($(`<td>`).append($btn2));

    return $format;
};

module.exports = _makeHtml;