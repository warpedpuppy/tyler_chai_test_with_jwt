'use strict'

$(function () {

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

        // Create the structure for a card

        function createAlbum(destination) {
            let activityImgs = "";
            destination.activities.forEach(activity => {
                activityImgs += `<img src="${activity.url}">`;
            })
            return `
            <div class="public-dest">
            <div class="dest-album i${destination.id}">
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
