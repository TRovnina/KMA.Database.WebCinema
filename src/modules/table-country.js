//створити рядок з країною у таблиці
let _makeHtml = ({
                     id_country,
                     name,
                     notes
                 }) => {
    let $country = $(`<tr>`);
    $country.append($(`<td>`).append($(`<input type="text" class="form-control" value="${id_country}">`)));
    let x = id_country + "name";
    $country.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${name}">`)));
    x = id_country + "notes";
    $country.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${notes}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-c" data-country-id="${id_country}">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-c" data-country-id="${id_country}">`).text("Видалити");

    $country.append($(`<td>`).append($btn1));
    $country.append($(`<td>`).append($btn2));

    return $country;
};

module.exports = _makeHtml;