//створити рядок з фільмом у таблиці
let _makeHtml = ({
                     Imdb,
                     Name,
                     OriginalName,
                     Image
                 }) => {
    let $film = $(`<tr>`);
    $film.append($(`<td>`).append($(`<img src="${Image}" alt="poster" class="img-fluid">`)));
    $film.append($(`<td>`).text(Imdb));
    $film.append($(`<td>`).text(Name));
    $film.append($(`<td>`).text(OriginalName));

    let $btn1 = $(`<button type="button" class="btn btn-info Film-edit" data-film-id="${Imdb}">`).text("Редагуати");
    $film.append($(`<td>`).append($btn1));

    let $btn2 = $(`<button type="button" class="btn btn-info Film-del" data-film-id="${Imdb}">`).text("Видалити");
    $film.append($(`<td>`).append($btn2));

    return $film;
};

module.exports = _makeHtml;