//створення сторінки з описом фільма

let _makeHtml = ({
                     id,
                     name,
                     imdb,
                     description,
                     country,
                     year,
                     poster,
                     trailer,
                     original,
                     duration,
                     limit
                 }) => {
    let $film = $(`<div data-film-id="${id}">`);

    let $block1 = $(`<div class="col-sm-3 poster-block">`);
    $block1.append($(`<img src="${poster}" alt="${name}" class="img-fluid">`));
    $block1.append($(`<button type="button" class="btn btn-dark" onClick='location.href="${trailer}"'>`).text("Дивитись трейлер"));

    let $block2 = $(`<div class="col-sm-9">`);
    $block2.append($(`<h2 class="film-title">`).text(${name}));

    let $block3 = $(`<div class="film-description">`);
    $block3.append($(`<span>`).append($(`<b>`).text("IMDb:")).text(imdb));
    $block3.append($(`<span>`).append($(`<b>`).text("Вікове обмеження:")).text(limit));
    $block3.append($(`<span>`).append($(`<b>`).text("Оригінальна назва:")).text(original));
    $block3.append($(`<span>`).append($(`<b>`).text("Рік:")).text(year));
    $block3.append($(`<span>`).append($(`<b>`).text("Тривалість:")).text(duration));
    $block3.append($(`<span>`).append($(`<b>`).text("Країна:")).text(country));
    $block3.append($(`<p class="description">`).text(description));

    $block2.append($block3);

    $film.append($block1);
    $film.append($block2);

    return $film;
};

module.exports = _makeHtml;