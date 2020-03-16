//створити картку фільма
let _makeHtml = ({
                     name,
                     imdb,
                     description,
                     country,
                     year,
                     poster,
                     trailer,
                     original,
                     duration,
                     genres,
                     limit
                 }) => {
    let $film = $(`<div class="p-2 film film_card card col-xs-12 col-sm-4 col-md-3" data-film-id="${imdb}">`);
    $film.append($(`<img src="${poster}" alt="${name}" class="img-fluid film-image">`));
    $film.append($(`<span class="film-title">`).text(name));
    return $film;
};

module.exports = _makeHtml;