//створити рядок з жанром у таблиці
let _makeHtml = ({
                     id_genre,
                     name,
                     notes
                 }) => {
    let $genre = $(`<tr id="${id_genre}">`);
    $genre.append($(`<td>`).append($(`<input type="text" class="form-control g-name" required value="${name}">`)));
    $genre.append($(`<td>`).append($(`<input type="text" class="form-control g-description" value="${notes}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-g">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-g">`).text("Видалити");

    $genre.append($(`<td>`).append($btn1));
    $genre.append($(`<td>`).append($btn2));

    return $genre;
};

module.exports = _makeHtml;