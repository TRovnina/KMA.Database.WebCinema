//створити рядок з країною у таблиці
let _makeHtml = ({
                     id_country,
                     name,
                     notes
                 }) => {
    let $country = $(`<tr id="${id_country}">`);
    $country.append($(`<td>`).append($(`<input type="text" class="form-control с-name" required value="${name}">`)));
    $country.append($(`<td>`).append($(`<input type="text" class="form-control с-description" value="${notes}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-g">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-g">`).text("Видалити");

    $country.append($(`<td>`).append($btn1));
    $country.append($(`<td>`).append($btn2));

    return $country;
};

module.exports = _makeHtml;