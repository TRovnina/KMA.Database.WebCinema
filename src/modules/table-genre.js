//створити рядок з жанром у таблиці
let _makeHtml = ({
                     id_genre,
                     name,
                     notes
                 }) => {
    let $genre = $(`<tr>`);
    let x = id_genre + "name";
    $genre.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${name}">`)));
    x = id_genre + "notes";
    $genre.append($(`<td>`).append($(`<input type="text" class="form-control" id="${x}" value="${notes}">`)));

    let $btn1 = $(`<button type="button" class="btn btn-info edit-g" data-genre-id="${id_genre}">`).text("Редагуати");
    let $btn2 = $(`<button type="button" class="btn btn-info del-g" data-genre-id="${id_genre}">`).text("Видалити");

    $genre.append($(`<td>`).append($btn1));
    $genre.append($(`<td>`).append($btn2));

    return $genre;
};

module.exports = _makeHtml;