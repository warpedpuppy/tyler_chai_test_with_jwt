$(function () {
    const myToken = sessionStorage.getItem("token");
    let newDestination;
    function verifyLogin() {
        $.ajax({
            url: `/api/auth/app_protected`,
            type: 'GET',
            headers: { 'authorization': `Bearer ${myToken}` },
            success: function (data) {
                console.log("Token valid.");
                console.log(myToken);
                loadApp();
            },
            error: function () {
                console.log("Token invalid!");
                $(".login-modal").removeClass("hide-me");
            }
        });
    }

    $(".sign-out-button ").on("click", function (e) {
        e.preventDefault();
        sessionStorage.setItem("token", "");
        window.location.replace("/");
    })

    verifyLogin();

    function loadApp() {

        $(".container").html("");

        $(".sign-out-button").removeClass("hide-me");

        // Create the structure for a new card

        const newCard = function () {
            return `<div class="card new-dest-card shadow">
            <div class="close-card-button hide-me">
                <a href="#">
                    <i class="fa fa-times-circle"></i>
                </a>
            </div>
            <div class="card-button hide-me">
                <button class="save-button">Save</button>
                <button class="complete-button">Complete</button>
            </div>
            <h3 contenteditable="true" placeholder="Where would you like to go!?"></h3>
            <ul class="activitiesList">
                <li contenteditable="true" placeholder="What should we do there?"></li>
            </ul>
            <div class="card-button hide-me">
                <a href="#">
                    <i class="fa check-circle"></i>
                </a>
            </div>
        </div>`
        };

        $("main").append(newCard());

        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "/api/destinations",
            "method": "GET",
            "headers": {
                "Authorization": `Bearer ${myToken}`
            }
        }).done(function (DESTINATIONS) {
            function getMyDestinations(callbackFn) {
                setTimeout(function () { callbackFn(DESTINATIONS) }, 100);
            };

            function displayMyDestinations(destinations) {
                let returnStr = "";
                for (let destination of destinations) {
                    $('main').append(createCard(destination));
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

        function createCard(destination) {
            let activityStr = "";
            destination.activities.forEach(activity => {
                activityStr += `<li contenteditable="true" >${activity.name}</li>`;
            })
            return `
    <div class="card dest-card shadow hawaii-card" id="i${destination._id}">
        <div class="close-card-button hide-me">
            <a href="#"><i class="fa fa-times-circle"></i></a>
        </div>
        <div class="card-button hide-me">
            <button class="update-button">Save</button> <button class="complete-button">Complete</button>
        </div>
        <h3 contenteditable="true">${destination.name}</h3>
        <ul class="activitiesList">${activityStr}</ul>
        <div class="card-button hide-me">
        <a href="#">
            <i class="fa check-circle"></i>
        </a>
    </div>
    </div>`
        };

        // Open the card on click

        $("body").on("click", ".card", function (e) {
            e.preventDefault();
            $(this).addClass("card-open").removeClass("card");
            $(".close-card-button, .card-button").removeClass("hide-me");
            $(".card, .h1").addClass("hide-me");
        });

        // Close the card when user clicks the X

        $("body").on("click", ".close-card-button", function (e) {
            e.preventDefault();
            $(".close-card-button, .card-button").addClass("hide-me");
            $(".card-open").removeClass("card-open").addClass("card");
            $(".card").removeClass("hide-me");
        });

        // Pressing enter creates a new item

        const newListItem = `<li contenteditable="true"></li>`
        $("body").on("keydown", ".activitiesList", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).append(newListItem);
            }
        });

        // Save button on a new card POSTs it to the database

        $("body").on("click", ".save-button", function (e) {
            e.preventDefault();
            let name = $(this).parent().siblings("h3").text();
            let complete = false;
            let published = false;

            let activities = [];
            $(this).parent().siblings('.activitiesList').each(function () {
                let activity = {};
                $(this).find('li').each(function () {
                    var current = $(this).text();
                    // Skip empty activities
                    if (current.length > 0) {
                        let activity = {
                            "name": current,
                            "url": ""
                        }
                        activities.push(activity);
                    }
                });
            });

            newDestination = { name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "/api/destinations",
                "method": "POST",
                "data": newDestination,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function () {
                    loadApp()
                },
                "error": function (err) {
                    alert(err.responseText);
                }
            });
        })

        // Save button on existing card PUTs the new version to the database

        $("body").on("click", ".update-button", function (e) {
            e.preventDefault();
            let cardID = $(".card-open").attr("id");
            let id = cardID.slice(1);
            let name = $(`#${cardID} h3`).text();
            let complete = false;
            let published = false;

            let activities = [];
            $(this).parent().siblings('.activitiesList').each(function () {
                let activity = {};
                $(this).find('li').each(function () {
                    var current = $(this).text();
                    // Skip empty activities
                    if (current.length > 0) {
                        let activity = {
                            "name": current,
                            "url": ""
                        }
                        activities.push(activity);
                    }
                });
            });

            newDestination = { name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/id/${id}`,
                "method": "PUT",
                "data": newDestination,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function () {
                    alert("Destination saved!");
                },
                "error": function (err) {
                    alert(err.responseText);
                }
            });
        })

        // Complete destination card HTML

        function completeCard() {
            return `
            <h3>${newDestination.name}</h3>
            <div class="close-card-button">
                <a href="#"><i class="fa fa-times-circle"></i></a>
            </div>
            <div class="upload-wizard">
                <p>Great job! Now add photos of your activities and share your adventure!</p>
                <button class="upload-wizard-start">Start</button>
            </div>
            <div class="add-button-container shadow">
                <span class="add-button">+</span>
            </div>`
        }

        // Complete destination activity upload wizard HTML

        function uploadWizard(data) {
            console.log("Upload wizard called");
            let tempActivity;
            for (let activity of newDestination.activities) {
                console.log(activity);
                if (activity.url === "") {
                    tempActivity = activity;
                    console.log(`Data: ${data}`);
                    tempActivity.url = data;
                    console.log(`tempActivity.url: ${tempActivity.url}`);
                    tempActivity = activity;
                    console.log(activity);
                    console.log(newDestination.activities);
                    break;
                }
            }
            if (!tempActivity) {

                return
            }
            return `
            <h5>${tempActivity.name}</h5>
        <form ref='uploadForm' id='uploadForm' name='uploadForm'
            action='api/destinations/upload/${newDestination.name}' method='post' 
            encType="multipart/form-data">
              <input type="file" name="file" id="file" required />
              <input type='submit' value='Upload!' />
            </form>`
        }

        // Complete destination activity upload wizard functionality

        $('body').on('click', '.upload-wizard-start', function (e) {
            e.preventDefault();
            $('.upload-wizard').html(uploadWizard());
        })

        // Mark the destination as complete and allow photo uploads

        $("body").on("click", ".complete-button", function (e) {
            e.preventDefault();
            let cardID = $(".card-open").attr("id");
            let id = cardID.slice(1);
            let name = $(`#${cardID} h3`).text();
            let complete = true;
            let published = false;
            let activities = [];
            $(this).parent().siblings('.activitiesList').each(function () {
                let activity = {};
                $(this).find('li').each(function () {
                    var current = $(this).text();
                    // Skip empty activities
                    if (current.length > 0) {
                        let activity = {
                            "name": current,
                            "url": ""
                        }
                        activities.push(activity);
                    }
                });
            });

            newDestination = { name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/id/${id}`,
                "method": "PUT",
                "data": newDestination,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function () {
                    destName = $(`#${cardID} h3`).text();
                    $(".card-open").children().hide();
                    $(".card-open").append(completeCard());
                },
                "error": function (err) {
                    alert(err.responseText);
                }
            });
        });

        // Handle photo uploader form

        $("body").on("submit", "#uploadForm", function (e) {
            e.preventDefault();
            let destName = $('.card-open').children('h3').text();
            let formdata = new FormData();
            formdata.append('file', $('#file')[0].files[0]);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/upload/${destName}`,
                "method": "POST",
                "data": formdata,
                "processData": false,
                "contentType": false,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function (data) {
                    console.log(data);
                    $('.upload-wizard').html(uploadWizard(data));
                },
                "error": function (err) {
                    alert(err.responseText);
                }
            });
        })

    }
})
