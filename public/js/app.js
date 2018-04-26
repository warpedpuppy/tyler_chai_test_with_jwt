let MOCK_DESTINATIONS = {
    "destinations": [
        {
            "id": "111111",
            "name": "Hawaii",
            "completed": "no"
        },
        {
            "id": "222222",
            "name": "New York City",
            "completed": "no"
        },
        {
            "id": "333333",
            "name": "Tokyo",
            "completed": "no"
        }
    ]
};

function getMyDestinations(callbackFn) {
    setTimeout(function () { callbackFn(MOCK_DESTINATIONS) }, 100);
};

// why don't these have semicolons but the one above does

function displaMyDestinations(data) {
    for (i in data.destinations) {
        $('body').append('<div>' + data.destinations[i].name + '</div');
        // try this with a template string
    }
}

function getAndDisplayMyDestinations() {
    getMyDestinations(displayMyDestinations);
}

$(function () {
    getAndDisplayMyDestinations();
})