$("body").on("click", ".login-link", function(e){
    e.preventDefault();
    $(".login-modal").removeClass("hide-me");
});

$("body").on("click", ".close-card-button", function (e) {
    e.preventDefault();
    $(".login-modal").addClass("hide-me");
});

$("body").on("click", ".register-tab", function(e) {
    e.preventDefault();
    $("#login-form").addClass("hide-me");
    $("#register-form").removeClass("hide-me");
});
$("body").on("click", ".login-tab", function(e) {
    e.preventDefault();
    $("#register-form").addClass("hide-me");
    $("#login-form").removeClass("hide-me");
});