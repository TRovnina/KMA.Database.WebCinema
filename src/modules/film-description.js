//створення сторінки з описом фільма
let _makeHtml = ({
                     imdb,
                     name,
                     original_name,
                     description,
                     created_year,
                     duration,
                     age_restriction,
                     begin_date,
                     end_date,
                     premiere,
                     price,
                     image,
                     trailer,
                     notes,
                     genres,
                     countries,
                     sessions
                 }) => {
    let $film = $(`<div class="row" id="film_main" data-film-id="${imdb}">`);

    let $block1 = $(` <div class="col-md-3 col-xs-12 col-sm-2 poster-block">`);
    $block1.append($(` <img src="${image}" alt="${name}" class="img-fluid film-image">`));
    $block1.append($(`<button type="button" class="btn btn-primary" onClick='location.href="${trailer}"'>`).text("Дивитись трейлер"));

    let $block2 = $(`<div class="col-md-6 col-xs-12 col-sm-6">`);
    $block2.append($(`<h2 class="film-title">`).text(name));

    let $description = $(`<div class="film-description">`);
    $description.append($(`<span>`).append($(`<b>`).text("IMDb:")).text(imdb));
    $description.append($(`<span>`).append($(`<b>`).text("Оригінальна назва:")).text(original_name));
    $description.append($(`<span>`).append($(`<b>`).text("Вікове обмеження:")).text(age_restriction));
    $description.append($(`<span>`).append($(`<b>`).text("Рік:")).text(created_year));
    $description.append($(`<span>`).append($(`<b>`).text("Тривалість:")).text(duration));

    let $countries = $(`<span>`).append($(`<b>`).text("Країна:"));
    countries.forEach(c => {
        $countries.text(c);
    });
    $description.append($countries);
    let $genres = $(`<span>`).append($(`<b>`).text("Жанри:"));
    genres.forEach(g => {
        $genres.text(g);
    });
    $description.append($genres);
    $description.append($(`<p class="description">`).text(description));
    $block2.append($description);

    let $block3 = $(`<div id="sessions" class="col-md-3 col-xs-12 col-sm-3">`);

    if (sessions.length != 0) {
        $block3.append($(`<h2 class="film-title">`).text("Сеанси"));

        sessions.forEach(s => {
            let $s_day = $(`<div class="session-day">`);
            $s_day.append($(`<span>`).text(s.key));
            let $s_times = $(`<div class="session-time row container">`);
            s.value.forEach(({
                                 session_id,
                                 begin_time,
                                 language,
                                 format
                             }) => {
                let $s_inf = $(`<div class="session-info col-xs-4 col-sm-3 col-md-3" data-session-id="${session_id}">`);
                $s_inf.append($(`<span>`).text(format));
                $s_inf.append($(`<span>`).text(language));
                $s_inf.append($(`<br>`));
                $s_inf.append($(`<button class="btn time-btn">`).text(begin_time));
                $s_times.append($s_inf);
            });

            $s_day.append($s_times);
            $block3.append($s_day);
        });
    }
    $film.append($block1);
    $film.append($block2);
    $film.append($block3);

    return $film;
};

module.exports = _makeHtml;