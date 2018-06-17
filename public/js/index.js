'use strict'

$(function () {

    // Display published destination albums

    function loadHomepage() {

        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "/api/destinations/public",
            "method": "GET"
        }).done(function (DESTINATIONS) {
            function getMyDestinations(callbackFn) {
                setTimeout(function () { callbackFn(DESTINATIONS) }, 100);
            };

            function displayMyDestinations(destinations) {
                let returnStr = "";
                for (let destination of destinations) {
                    $('.dest-section').append(createAlbum(destination));
                }
            };

            function getAndDisplayMyDestinations() {
                getMyDestinations(displayMyDestinations);
            }
            $(function () {
                getAndDisplayMyDestinations();
            })
        })

        // Destination album

        function createAlbum(destination) {
            let activityImgs = "";
            destination.activities.forEach(activity => {
                activityImgs += `<img src="${activity.url}">`;
            })
            return `
            <div class="public-dest">
            <div class="dest-album i${destination._id}">
                <div class="dest-gradient"></div>
                <div class="dest-img">
                    ${activityImgs}
                </div>
                <div class="dest-label">
                    <h3 class="dest-name">${destination.name}</h3>
                    <p class="dest-author">
                        <i class="fa fa-user-circle"></i> ${destination.user}
                    </p>
                </div>
            </div>
        </div>
            `
        };

    }
    loadHomepage();

});

// Display Help Modal

$("body").on("click", ".help-modal button", function (e) {
    e.preventDefault();
    $(".help-modal").addClass("hide-me");
    $(".login-modal").removeClass("hide-me");
    $("#login-form").addClass("hide-me");
    $("#register-form").removeClass("hide-me");
    $(".register-tab").addClass("login-menu-active").removeClass("login-menu-passive");
    $(".login-tab").removeClass("login-menu-active").addClass("login-menu-passive");
    $("#register-success").addClass("hide-me");
});