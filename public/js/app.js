let MOCK_DESTINATIONS = {
    "destinations": [
        {
            "id": "111111",
            "name": "Hawaii",
            "completed": "no",
            "activities": ["Go surfing", "Meet Lilo & Stitch", "Fly over an active volcano"]
        },
        {
            "id": "222222",
            "name": "New York City",
            "completed": "no",
            "activities": ["See Times Square", "Climb the Statue of Liberty", "Walk through Central Park"]

        },
        {
            "id": "333333",
            "name": "Tokyo",
            "completed": "no",
            "activities": ["Photo with Mickey at Tokyo Disneyland", "Shop in the Ginza District", "Meet a Geisha at Omotenashi Nihonbashi"]

        }
    ]
};

function getMyDestinations(callbackFn) {
    setTimeout(function () { callbackFn(MOCK_DESTINATIONS) }, 100);
};

// why don't these have semicolons but the one above does

function createCard(id, name) {
    return `
    <div class="card dest-card shadow hawaii-card i${id}">
        <div class="close-card-button hide-me">
            <a href="#"><i class="fa fa-times-circle"></i></a>
        </div>
        <div class="complete-card-button hide-me">
            <button>Complete</button>
        </div>
        <h3 contenteditable="true">${name}</h3>
        <ul class="activitiesList"></ul>
        <div class="complete-card-button hide-me">
        <a href="#">
            <i class="fa check-circle"></i>
        </a>
    </div>
    </div>`
}

function displayMyDestinations(data) {
    for (i of data.destinations) {
        $('.container').append(createCard(i.id, i.name));
        $(i.activities).each(function (activity) {
            let thisDestination = `.i${i.id}`;
            $(thisDestination).append(`<li>${i.activities[activity]}</li>`);
        });

    }
}

function getAndDisplayMyDestinations() {
    getMyDestinations(displayMyDestinations);
}
$(function () {
    getAndDisplayMyDestinations();
})
// Open the card on click

$("body").on("click", ".card", function (e) {
    e.preventDefault();
    $(this).addClass("card-open").removeClass("card");
    $(".close-card-button, .complete-card-button").removeClass("hide-me");
    $(".card, .h1").addClass("hide-me");
});

// Close the card when user clicks the X

$("body").on("click", ".close-card-button", function (e) {
    e.preventDefault();
    $(".close-card-button, .complete-card-button").addClass("hide-me");
    $(".card-open").removeClass("card-open").addClass("card");
    $(".card").removeClass("hide-me");
});

function completeCard() {
    return `
    <h3>Publish your destination</h3>
    <div class="close-card-button">
        <a href="#"><i class="fa fa-times-circle"></i></a>
    </div>
    <p>Great job! Now add your photos and share your adventure!</p>
    <div class="pending-uploads">
    </div>
    <div class="add-button-container shadow">
        <span class="add-button">+</span>
    </div>`
}

// Mark the card as complete and allow photo uploads

$("body").on("click", ".complete-card-button", function () {
    $(".card-open").children().hide();
    $(".card-open").append(completeCard());
});

$("body").on("click", ".complete-cardbutton add-button", function () {
    // $(".pending-uploads");
});