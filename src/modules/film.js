//створити картку фільма
let _makeHtml = ({
                     imdb,
                     name,
                     image,
                     sessions
                 }) => {

    let $film = $(`<div class="film_card col-xs-12 col-sm-12 col-md-12" data-film-id="${imdb}">`);
    $film.append($(`<img src="${image}" alt="${name}" class="img-fluid film-image main-poster col-xs-12 col-sm-4 col-md-3">`));

    let $block = $('<div class="d-inline-block col-xs-12 col-sm-7 col-md-8">');
    $block.append($(`<span class="film-title">`).text(name));
    $block.append($(`<br>`));

    let $sessions = $('<div class="session-time row container">');
    sessions.forEach(({
                          session_id,
                          begin_time,
                          language,
                          format
                      }) => {
        let $s_inf = $(`<div class="session-info col-xs-4 col-sm-3 col-md-3" data-session-id="${session_id}">`);
        $s_inf.append($(`<span>`).text(format));
        $s_inf.append($(`<span>`).text(" / " + language));
        $s_inf.append($(`<br>`));
        $s_inf.append($(`<button class="btn time-btn">`).text(begin_time));

        $sessions.append($s_inf);
    });

    $block.append($sessions);
    $film.append($block);

    return $film;
};

module.exports = _makeHtml;