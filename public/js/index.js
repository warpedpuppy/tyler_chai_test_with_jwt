$("body").on("click", ".login-link", function (e) {
    e.preventDefault();
    $(".login-modal").removeClass("hide-me");
});

$("body").on("click", ".close-card-button", function (e) {
    e.preventDefault();
    $(".login-modal").addClass("hide-me");
});

$("body").on("click", ".register-tab", function (e) {
    e.preventDefault();
    $("#login-form").addClass("hide-me");
    $("#register-form").removeClass("hide-me");
    $(".register-tab").addClass("login-menu-active").removeClass("login-menu-passive");
    $(".login-tab").removeClass("login-menu-active").addClass("login-menu-passive");
});
$("body").on("click", ".login-tab", function (e) {
    e.preventDefault();
    $("#register-form").addClass("hide-me");
    $("#login-form").removeClass("hide-me");
    $(".login-tab").addClass("login-menu-active").removeClass("login-menu-passive");
    $(".register-tab").removeClass("login-menu-active").addClass("login-menu-passive");
});
$("body").on("click", "#register-success > button", function(e) {
    e.preventDefault();
    $("#register-success").addClass("hide-me");
    $("#login-form").removeClass("hide-me");
    $(".login-tab").addClass("login-menu-active").removeClass("login-menu-passive");
    $(".register-tab").removeClass("login-menu-active").addClass("login-menu-passive");
});

$("#register-form").submit(function (e) {
    e.preventDefault();
    let newUserObj = {
        "username": $("#new-name").val(),
        "password": $("#new-password").val(),
        "name": $("#new-name").val(),
};
    $.ajax({
        type: "POST",
        url: "/api/users",
        dataType: "json",
        contentType : 'application/json',
        data: JSON.stringify(newUserObj),
        success: function(data){
            console.log("User created.");
            $("#register-form input").val("");
            $("#register-form").addClass("hide-me");
            $("#register-success").removeClass("hide-me");
        },
        error: function(error) {
            console.error(error);
        }
    })
});