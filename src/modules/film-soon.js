//створити картку фільма, який буде скоро в прокаті
let _makeHtml = ({
                     imdb,
                     name,
                     image,
                     sessions
                 }) => {
    let $film = $(`<div class="p-2 film_card card col-xs-12 col-sm-4 col-md-3" data-film-id="${imdb}">`);
    $film.append($(`<img src="${image}" alt="${name}" class="img-fluid film-image">`));
    $film.append($(`<span class="film-title">`).text(name));
    return $film;
};

module.exports = _makeHtml;