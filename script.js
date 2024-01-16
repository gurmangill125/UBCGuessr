    let map, panorama, currentLocation, score = 0;
    let miniMap, guessMarker, infoWindow;

    function initMap() {
        // Set a random start location from predefined UBC locations
        currentLocation = getRandomLocation();

        // Initialize Street View Panorama
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById('streetView'),
            {
                position: currentLocation,
                pov: { heading: 34, pitch: 10 },
                zoom: 1,
                visible: true
            }
        );

        // Initialize Map, but do not display it yet
        map = new google.maps.Map(document.getElementById('mapPlaceholder'), {
            center: currentLocation,
            zoom: 15,
            streetViewControl: false
        });
        map.setStreetView(panorama); // Bind the map to the Street View control

        // Listen for the guess
        document.getElementById('guessButton').addEventListener('click', makeGuess);
    }

    const locations = [
        {lat: 49.267132, lng: -123.252494}, // UBC Rose Garden
        {lat: 49.260605, lng: -123.245994}, // UBC Main Mall
        {lat: 49.269929, lng: -123.258107}, // Museum of Anthropology
        {lat: 49.260864, lng: -123.239336}, // UBC Thunderbird Arena
        {lat: 49.264872, lng: -123.253070}  // UBC Biological Sciences Building
    ];

    function initGame() {
        initMap(); // Initializes the Street View and main map
        initMiniMap(currentLocation); // Initializes the mini-map but doesn't display it yet
    }


    function makeGuess() {
        toggleMiniMap(true); // Show the mini-map for making a guess
        // Hide the main map - we will show it later with the result
        document.getElementById('mapPlaceholder').style.display = 'none'; 
        // Disable the Street View interaction
        panorama.setOptions({ disableDefaultUI: true, clickToGo: false, panControl: false, zoomControl: false });
    }

    function placeGuessMarker(location) {
        if (guessMarker) {
            guessMarker.setPosition(location); // Move the existing marker to the new location
        } else {
            guessMarker = new google.maps.Marker({
                position: location,
                map: miniMap,
                title: "Your Guess",
                draggable: true // Allow the player to drag and reposition the marker
            });
        }
        // Show the result and then end the round
        showGuessResult(location);
    }



    function startNewRound() {
        // Reset the score if you want to start a new game
        // score = 0; // Uncomment this line if you want to reset the score on a new round

        currentLocation = getRandomLocation();
        panorama.setPosition(currentLocation);
        panorama.setPov({ heading: 34, pitch: 10 });
        panorama.setVisible(true);
        document.getElementById('streetView').style.display = 'block';
        document.getElementById('mapPlaceholder').style.display = 'none';

        // Reset the info window and polyline if they exist
        if (infoWindow) {
            infoWindow.close();
            infoWindow = null;
        }

        // Initialize the mini-map for the new round
        initMiniMap(currentLocation);
        toggleMiniMap(false); // Ensure the mini-map is hidden until 'Make a Guess' is clicked again
    }

    function updateScore(distance) {
    // Points calculation can be refined depending on desired difficulty
    let points = Math.max(0, 10000 - Math.round(distance));
    score += points;
    document.getElementById('scoreBoard').innerText = 'Score: ' + score;
    }

    function getRandomLocation() {
    return locations[Math.floor(Math.random() * locations.length)];
    }


// The initMiniMap function initializes the mini-map and adds the 'click' event listener
function initMiniMap(location) {
    miniMap = new google.maps.Map(document.getElementById('miniMap'), {
        center: location,
        zoom: 15
    });

    // Ensure any previous listeners are removed before adding a new one
    google.maps.event.clearListeners(miniMap, 'click');
    miniMap.addListener('click', function(mapsMouseEvent) {
        // Confirm the guess before placing the marker
        if (confirm('Confirm your guess here?')) {
            placeGuessMarker(mapsMouseEvent.latLng);
        }
    });
}



    function toggleMiniMap(show) {
        document.getElementById('miniMapContainer').style.display = show ? 'block' : 'none';
    }


    function showGuessResult(guessPosition) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(guessPosition, currentLocation);
        const points = Math.max(0, 10000 - Math.round(distance)); // Example scoring formula
        score += points;
        
        const contentString = `
            <div style="color: black;">
                <p>Your guess was ${distance.toFixed(2)} meters (${(distance / 1000).toFixed(2)} km) from the correct location.</p>
                <p>You earned another ${points} points.</p>
            </div>
        `;

        if (infoWindow) infoWindow.close(); // Close the previous info window if any

        infoWindow = new google.maps.InfoWindow({
            content: contentString,
            position: guessPosition
        });
        infoWindow.open(map);

        // Draw a line between the guess and the actual location
        const line = new google.maps.Polyline({
            path: [guessPosition, currentLocation],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        line.setMap(map);

        // Update the score display
        document.getElementById('scoreBoard').innerText = 'Score: ' + score;

        // Disable further guessing by removing the guess marker and clearing event listeners
        if (guessMarker) {
            guessMarker.setMap(null); // Remove the guess marker
            guessMarker = null;
        }
        google.maps.event.clearListeners(miniMap, 'click');

        // After showing the result, ask the user if they want to continue to the next round
        setTimeout(() => {
            if (confirm('Play next round?')) {
                startNewRound();
            } else {
                // Here you can handle the action for viewing the summary or ending the game
                // For example, show a game summary or leaderboard
            }
        }, 5000); // Wait 5 seconds before showing the prompt
    }


    miniMap.addListener('click', function(mapsMouseEvent) {
        if (guessMarker) guessMarker.setMap(null); // Remove the previous guess marker if it exists

        // Place the guess marker at the location the player clicked
        guessMarker = new google.maps.Marker({
            position: mapsMouseEvent.latLng,
            map: miniMap,
            title: "Your Guess",
            draggable: true // Allow the player to drag and reposition the marker
        });

        // Bind the drag end event to update the guess position
        guessMarker.addListener('dragend', function() {
            showGuessResult(guessMarker.getPosition());
        });
    });

// Initialize the game inside an onload handler to ensure all elements are loaded
window.onload = function() {
    initGame(); // Call initGame here, not initMap
};