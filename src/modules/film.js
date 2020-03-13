//створити картку фільма
let _makeHtml = ({
                     id,
                     name,
                     image_url,
                     description,
                 }) => {
    let $film = $(`<div class="p-2 film film_card card col-xs-12 col-sm-4 col-md-3" data-film-id="${id}">`);
    $film.append($(`<img src="${image_url}" alt="${name}" class="img-fluid">`));
    $film.append($(`<span class="film-title">`).text(name));
    return $film;
};

module.exports = _makeHtml;