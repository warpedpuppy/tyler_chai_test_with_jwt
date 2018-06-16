$(function () {
    const myToken = sessionStorage.getItem("token");
    // let myDestinations;
    let myDestination;
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
            // myDestinations = DESTINATIONS;
            // console.log(myDestinations);
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
    }

        // Create the structure for a card

        function createCard(destination) {
            let activityStr = "";
            destination.activities.forEach(activity => {
                activityStr += `<li contenteditable="true" id="i${activity._id}">${activity.name}</li>`;
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

            myDestination = { name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "/api/destinations",
                "method": "POST",
                "data": myDestination,
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

            myDestination = { name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/id/${id}`,
                "method": "PUT",
                "data": myDestination,
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
            <h3>${myDestination.name}</h3>
            <div class="close-card-button">
                <a href="#"><i class="fa fa-times-circle"></i></a>
            </div>
            <div class="upload-wizard">
                <p>Great job! Now add photos of your activities and share your adventure!</p>
                <button class="upload-wizard-start">Start</button>
            </div>`
        }

        // Mark the destination as complete and allow photo uploads

        $("body").on("click", ".complete-button", function (e) {
            e.preventDefault();
            let cardID = $(".card-open").attr("id");
            let name = $(`#${cardID} h3`).text();
            let id = cardID.slice(1);
            let complete = true;
            let published = false;
            let activities = [];
            let lis = $(this).parent().siblings('.activitiesList').children();
            lis.each(function (i, v) {
                var currentActivity = $(this).text();
                var currentActivityID = $(this).attr('id');
                currentActivityID = currentActivityID.slice('1');
                console.log(currentActivityID);
                // Skip empty activities
                if (currentActivity.length > 0) {
                    let activity = {
                        "name": currentActivity,
                        "url": "",
                        "id": currentActivityID
                    }
                    activities.push(activity);
                }
            });

            myDestination = { id, name, complete, published, activities };
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/id/${myDestination.id}`,
                "method": "PUT",
                "data": myDestination,
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


        // Complete destination activity upload wizard HTML
        function uploadWizard() {
            console.log("Upload wizard called");
            let tempActivity;
            for (let activity of myDestination.activities) {
                if (activity.url === "") {
                    tempActivity = activity;
                    break;
                }
            }
            if (!tempActivity) {


                // Allow publishing destination when all activities have photos

                return `
            <div class="close-card-button">
                <a href="#"><i class="fa fa-times-circle"></i></a>
            </div>
            <div class="upload-wizard">
                <p>Congratulations! Let's publish your destination album to the homepage for all to see!</p>
                <button class="upload-wizard-publish-button">Publish</button>
            </div>`

            }

            // Loop through upload form until all activities have photos

            return `
                <h5>${tempActivity.name}</h5>
            <form ref='uploadForm' id='uploadForm' name='uploadForm'
                action='api/destinations/upload/${myDestination.name}' method='post' 
                encType="multipart/form-data">
                  <input type="hidden" name="activityID" value="${tempActivity.id}" />
                  <input type="hidden" name="activityName" value="${tempActivity.name}" />
                  <input type="file" name="file" id="file" required />
                  <input type='submit' value='Upload!' />
                </form>`

        }

        // Complete destination activity upload wizard functionality

        $('body').on('click', '.upload-wizard-start', function (e) {
            e.preventDefault();
            $('.upload-wizard').html(uploadWizard());
        })

        // Handle photo uploader form

        $("body").on("submit", "#uploadForm", function (e) {
            e.preventDefault();
            let formdata = new FormData();
            formdata.append('activityID', $('input[name=activityID]').val());
            formdata.append('activityName', $('input[name=activityName]').val());
            formdata.append('file', $('#file')[0].files[0]);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/upload/${myDestination.name}`,
                "method": "POST",
                "data": formdata,
                "processData": false,
                "contentType": false,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function (data) {
                    console.log(`updated activity object`, data);
                    for (let activity of myDestination.activities) {
                        if (activity.id === data._id) {
                            activity.url = data.url;
                            break;
                        }
                    }

                    $('.upload-wizard').html(uploadWizard());
                },
                "error": function (err) {
                    alert(`error`, err.responseText);
                }
            });
        })

        // Publish destination 

        $("body").on("click", ".upload-wizard-publish-button", function (e) {
            e.preventDefault();
            myDestination.published = true;
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/id/${myDestination.id}`,
                "method": "PUT",
                "data": myDestination,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function () {
                    alert('Your destination has been published! Check it out on the homepage!');
                },
                "error": function (err) {
                    alert(err.responseText);
                }
            });
        })



})
