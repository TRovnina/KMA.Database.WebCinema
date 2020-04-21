//створити рядок з мовою у таблиці
let _makeHtml = ({
                     language_id,
                     name,
                     price_percent
                 }) => {
    let $lang = $(`<tr>`);
    $lang.append($(`<td>`).append($(`<input type="text" class="form-control" value="${language_id}">`)));
    let x = language_id + "name";
    $lang.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${name}">`)));
    x = language_id + "number";
    $lang.append($(`<td>`).append($(`<input type="number" class="form-control" id="${x}" value="${price_percent}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-l" data-lang-id="${language_id}">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-l" data-lang-id="${language_id}">`).text("Видалити");

    $lang.append($(`<td>`).append($btn1));
    $lang.append($(`<td>`).append($btn2));

    return $lang;
};

module.exports = _makeHtml;