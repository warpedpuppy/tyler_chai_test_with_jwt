let MOCK_DESTINATIONS = {
    "destinations": [
        {
            "id": "111111",
            "name": "Hawaii",
            "completed": "no",
            "activities": ["Go surfing","Meet Lilo & Stitch","Fly over an active volcano"]
        },
        {
            "id": "222222",
            "name": "New York City",
            "completed": "no",
            "activities": ["See Times Square","Climb the Statue of Liberty","Walk through Central Park"]

        },
        {
            "id": "333333",
            "name": "Tokyo",
            "completed": "no",
            "activities": ["Photo with Mickey at Tokyo Disneyland","Shop in the Ginza District","Meet a Geisha at Omotenashi Nihonbashi"]

        }
    ]
};

function getMyDestinations(callbackFn) {
    setTimeout(function () { callbackFn(MOCK_DESTINATIONS) }, 100);
};

// why don't these have semicolons but the one above does

function displayMyDestinations(data) {
    for (i in data.destinations) {
        $('.container').append(`<div class="card dest-card card-shadow hawaii-card i${data.destinations[i].id}"><div class="close-card-button hide-me"><a href="#"><i class="fa fa-times-circle"></i></a></div><h3 contenteditable="true">${data.destinations[i].name}</h3><ul class="activitiesList"></ul></div>`);
        $(data.destinations[i].activities).each(function(activity) {
            let thisDestination = `.i${data.destinations[i].id}`;
            $(thisDestination).append(`<li>${data.destinations[i].activities[activity]}</li>`);
        });

    }
}

function getAndDisplayMyDestinations() {
    getMyDestinations(displayMyDestinations);
}

$(function () {
    getAndDisplayMyDestinations();
})

$(".card").on("click", function(e) {
    e.preventDefault();
    $(this).addClass("card-open");
    $(".close-card-button").removeClass("hide-me");
});

$(".close-card-button").on("click", function(e) {
    e.preventDefault();
    console.log(this.parentElement);
    $(this.parentElement).removeClass("card-open");
    console.log(this);
    $(this).addClass("hide-me");
});
