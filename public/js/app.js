$(function () {
    const myToken = sessionStorage.getItem("token");
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

        $(".new-dest-card, .sign-out-button").removeClass("hide-me");

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
                    $('.container').append(createCard(destination));
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
    <div class="card dest-card shadow hawaii-card i${destination.id}">
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

        // Function containing HTML to allow uploading photos of completed destination

        function completeCard() {
            return `
    <h3>${destTitle}</h3>
    <div class="close-card-button">
        <a href="#"><i class="fa fa-times-circle"></i></a>
    </div>
    <p>Great job! Now add your photos and share your adventure!</p>
    <form ref='uploadForm' 
    id='uploadForm' name='uploadForm'
    action='api/destinations/upload/${destTitle}' 
    method='post' 
    encType="multipart/form-data">
      <input type="file" name="file" id="file" required />
      <input type='submit' value='Upload!' />
    </form>
    <div class="pending-uploads">
    </div>
    <div class="add-button-container shadow">
        <span class="add-button">+</span>
    </div>`
        }

        // Mark the destination as complete and allow photo uploads

        let destTitle = "";

        $("body").on("click", ".complete-button", function () {
            $(".card-open").children().hide();
            destTitle = $('.card-open').children('h3').text();
            $(".card-open").append(completeCard());
            // PUT request to toggle destination completed property
        });

        // Handle photo uploader form

        $("body").on("submit", "#uploadForm", function (e) {
            e.preventDefault();
            let destTitle = $('.card-open').children('h3').text();
            let formdata = new FormData();
            formdata.append('file', $('#file')[0].files[0]);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": `/api/destinations/upload/${destTitle}`,
                "method": "POST",
                "data": formdata,
                "processData": false,
                "contentType": false,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                },
                "success": function (data) {
                    console.log(data);
                },
                "error": function (err) {
                    console.log(err);
                }
            });
        })

        // $("body").on("click", ".card-button add-button", function () {
        //     // $(".pending-uploads");
        // });

        // Pressing enter creates a new item

        const newListItem = `<li contenteditable="true"></li>`
        $("body").on("keydown", ".activitiesList", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                $(this).append(newListItem);
            }
        });

        // Clicking the save button on a new card sends it to the database


        $("body").on("click", ".save-button", function (e) {
            e.preventDefault();
            let user = 'tyler';
            let name = $(this).parent().siblings("h3").text();
            let complete = false;
            let published = false;

            let activities = [];
            $(this).parent().siblings('.activitiesList').each(function () {
                let activity = {};
                $(this).find('li').each(function () {
                    var current = $(this).text();
                    let activity = {
                        "name": current
                    }
                    activities.push(activity);
                });
            });

            let newDestination = { user, name, complete, published, activities };
            console.log(newDestination);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "/api/destinations",
                "method": "POST",
                "data": newDestination,
                "headers": {
                    "Authorization": `Bearer ${myToken}`
                }
                // .done(
                // create a card from the new card and recreate a blank new card
                // )
            });
        });
    }
})
