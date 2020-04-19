//заповнити поля для створеня фільму інформацієюдля редагування
let _makeHtml = ({
                     film,
                     all_genres,
                     all_countries,
                     all_formats,
                     all_languages,
                     all_halls
                 }) => {

    all_genres.forEach(({
                            id_genre,
                            name,
                            notes
                        }) => {
        let $g = $(` <input type="checkbox" id="${id_genre}" name="fg" value="${id_genre}">`).text(name);
        $('#fgenres').append($g);
    });

    all_countries.forEach(({
                               id_country,
                               name,
                               notes
                           }) => {
        let $c = $(` <input type="checkbox" id="${id_country}" name="fc" value="${id_country}">`).text(name);
        $('#fcountries').append($c);
    });


    $('#fimb').val(film.imdb);
    $('#fname').val(film.name);
    $('#foriginal').val(film.original_name);
    $('#fimg').val(film.image);
    $('#fvideo').val(film.trailer);
    $('#fdescription').val(film.description);
    $('#fyear').val(film.created_year);
    $('#fduration').val(film.duration);
    $('#fage').val(film.age_restriction);
    $('#fbegin').val(film.begin_date);
    $('#fend').val(film.end_date);
    if (film.premiere)
        $('#fpremier').attr("checked", "");
    $('#fprice').val(film.price);
    $('#fnotes').val(film.notes);

    film.genres.forEach(g => {
        $('#' + g).attr("checked", "");
    });
    film.countries.forEach(c => {
        $('#' + c).attr("checked", "");
    });
    //дописати

    /*if (sessions.length != 0) {
        sessions.forEach(s => {
            let $s_day = $(`<div class="session-day">`);

            $s_day.append($(`<span>`).text(s.date));
            let $s_times = $(`<div class="session-time row container">`);
            s.sessions.forEach(({
                                    session_id,
                                    begin_time,
                                    language,
                                    format
                                }) => {
                let $s_inf = $(`<div class="session-info col-xs-5 col-sm-5 col-md-5" data-session-id="${session_id}">`);
                $s_inf.append($(`<span>`).text(format + " / " + language));
                $s_inf.append($(`<br>`));
                $s_inf.append($(`<button class="btn time-btn">`).text(begin_time));
                $s_times.append($s_inf);
            });

            $s_day.append($s_times);
            $block3.append($s_day);
        });
    }*/


    return null;
};

module.exports = _makeHtml;