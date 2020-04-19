//створити рядок з форматом у таблиці
let _makeHtml = ({
                     format_id,
                     name,
                     price_percent
                 }) => {
    let $format = $(`<tr id="${format_id}">`);
    $format.append($(`<td>`).append($(`<input type="text" class="form-control f-name" required value="${name}">`)));
    $format.append($(`<td>`).append($(`<input type="number" class="form-control f-increase" value="${price_percent}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-f">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-f">`).text("Видалити");

    $format.append($(`<td>`).append($btn1));
    $format.append($(`<td>`).append($btn2));

    return $format;
};

module.exports = _makeHtml;