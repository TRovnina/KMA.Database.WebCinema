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

    let $btn = $(`<button type="button" class="btn btn-info Film-edit" id="${Imdb}">`).text("Редагуати");
    $film.append($(`<td>`).append($btn));

    return $film;
};

module.exports = _makeHtml;