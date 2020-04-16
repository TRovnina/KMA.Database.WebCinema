//створити картку фільма
let _makeHtml = ({
                     year_from,
                     year_to,
                     duration_from,
                     duration_to,
                     age_restriction,
                     formats,
                     genres,
                     languages
                 }) => {
    //додамо жанри
    genres.forEach(({
                        id_genre,
                        name,
                        notes
                    }) => {
        $("#filter-genres").append($(`<input type="checkbox" name="genre" value="${id_genre}">`).text(name));
    });

    //додамо роки
    $("#year-range").append($(`<input type="text" name="yearFrom" placeholder="від" class="input-range" value="${year_from}">`));
    $("#year-range").append($(`<input type="text" name="yearTo" placeholder="до" class="input-range" value="${year_to}">`));

    //додамо тривалість
    $("#duration-range").append($(`<input type="text" name="durationFrom" placeholder="від" class="input-range" value="${duration_from}">`));
    $("#duration-range").append($(`<input type="text" name="durationTo" placeholder="до" class="input-range" value="${duration_to}">`));

    //додамо мови
    languages.forEach(({
                           language_id,
                           name,
                           price_percent
                       }) => {
        $("#filter-language").append($(`<option value="${language_id}">`).text(name));
    });
};

