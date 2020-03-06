$(document).ready(function(){

    $('#contacts').click(function(){
        $.ajax({
            url: "view/contacts.html",
            cache: false,
            success: function(html){
                $("#content").html(html);
            }
        });
    });
    $('#logIn').click(function(){
        $.ajax({
            url: "view/authorization.html",
            cache: false,
            success: function(html){
                $("#content").html(html);
            }
        });
    });
});