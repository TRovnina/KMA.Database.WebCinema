//заповнити поля для створеня фільму інформацієюдля редагування
let _makeHtml = ({
                     film,
                     all_genres,
                     all_countries,
                     all_formats,
                     all_languages,
                     all_halls
                 }) => {

    //додамо жанри
    all_genres.forEach(({
                            id_genre,
                            name,
                            notes
                        }) => {

        let $g = $(`<input type="checkbox" name="fg" value="${id_genre}">`);
        let $label = $(`<label for="${id_genre}">`).text(name);
        if(film != null && film.genres.indexOf(id_genre) != -1)
            $g.attr("checked", "");


        $('#fgenres').append($g);
        $('#fgenres').append($label);
        $('#fgenres').append($(`<br>`));
    });

    //додамо краъїни
    all_countries.forEach(({
                               id_country,
                               name,
                               notes
                           }) => {
        let $c = $(`<input type="checkbox" name="fc" value="${id_country}">`);
        let $label = $(`<label for="${id_country}">`).text(name);
        if(film != null && film.countries.indexOf(id_country) != -1)
            $c.attr("checked", "");


        $('#fcountries').append($c);
        $('#fcountries').append($label);
        $('#fcountries').append($(`<br>`));

    });

    all_formats.forEach(({
                             format_id,
                             name,
                             price_percent
                         }) => {
        let $f = $(`<option value="${format_id}">`).text(name);
        $('#fformat').append($f);
    });

    //додамо мови
    all_languages.forEach(({
                               language_id,
                               name,
                               price_percent
                           }) => {

        let $f = $(`<option value="${language_id}">`).text(name);
        $('#flang').append($f);
    });

    //додамо зали
    all_halls.forEach(({
                               number,
                               imax,
                               name,
                               seat_row_amount,
                               notes
                           }) => {

        let $h = $(`<option value="${number}">`);
        if (imax)
            $h.text(number + "(imax)");
        else
            $h.text(number);
        $('#fhall').append($h);
    });


    if (film != null) {
        $('#fimb').val(film.imdb);
        $('#fname').val(film.name);
        $('#foriginal').val(film.original_name);
        $('#fimg').val(film.image);
        $('#fvideo').val(film.trailer);
        $('#fdescription').val(film.description);
        $('#fyear').val(film.created_year);
        $('#fduration').val(film.duration);
        $('#fage').val(film.age_restriction);
        console.log(film.begin_date);
        console.log(film.end_date);
        $('#fbegin').val(film.begin_date);
        $('#fend').val(film.end_date);
        if (film.premiere)
            $('#fpremier').attr("checked", "");
        $('#fprice').val(film.price);
        $('#fnotes').val(film.notes);


        if(film.sessions.length != 0) {
            film.sessions.forEach(s => {
                    let $s_day = $(`<div class="session-day">`);

                    $s_day.append($(`<span>`).text(s.date));
                    let $s_times = $(`<div class="session-time row container">`);
                    s.sessions.forEach(({
                                            session_id,
                                            begin_time,
                                            language,
                                            format,
                                            hall,
                                            tickets
                                        }) => {
                        let $s_inf = $(`<div class="session-info col-xs-5 col-sm-5 col-md-5">`);
                        $s_inf.append($(`<span>`).text(format + " / " + language));
                        $s_inf.append($(`<br>`));
                        if(tickets == 0)
                            $s_inf.append($(`<button class="btn time-edit"  data-session-id="${session_id}">`).text(begin_time));
                        else
                            $s_inf.append($(`<button class="btn" disabled>`).text(begin_time));
                        $s_times.append($s_inf);
                    });
                    $s_day.append($s_times);

                    $('#sessions-editor').append($s_day);
                });
        }

    }
    return null;
};

module.exports = _makeHtml;