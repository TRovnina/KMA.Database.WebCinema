//створити картку чеку
let _makeHtml = ({
                     bill_id,
                     issue_date,
                     session_date,
                     session_time,
                     sum,
                     employee_name,
                     film_name,
                     format,
                     language,
                     image
                 }) => {

    let $bill = $(`<div class="p-2 bill_card card col-xs-12 col-sm-3 col-md-2" data-bill-id="${bill_id}">`);
    $bill.append($(`<img src="${image}" alt="${film_name}" class="img-fluid film-image">`));
    $bill.append($(`<span class="film-title">`).text(film_name));
    $bill.append($(`<span align="center">`).text(format + " / " + language));
    $bill.append($(`<span>`).append($(`<b>`).text("Дата видачі:")).append(issue_date));
    $bill.append($(`<span align="center">`).text("Сеанс"));

    let $td1 = $(`<td>`);
    $td1.append($(`<b>`).text("Дата:"));
    $td1.append($(`<br>`));
    $td1.append(session_date);
    let $td2 = $(`<td>`);
    $td2.append($(`<b>`).text("Час:"));
    $td2.append($(`<br>`));
    $td2.append(session_time);

    let $table = $(`<table>`);
    $table.append($(`<tr>`).append($td1).append($td2));
    $bill.append($table);
    $bill.append($(`<br>`));
    $bill.append($(`<span>`).append($(`<b>`).text("Касир:")).append(employee_name));
    $bill.append($(`<span>`).append($(`<b>`).text("Всього:")).append(sum + " грн"));

    return $bill;
};

module.exports = _makeHtml;