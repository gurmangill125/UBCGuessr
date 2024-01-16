let map, panorama, currentLocation, score = 0;

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
    { lat: 49.2606, lng: -123.2460 }, // Example coordinates for UBC location
];

function makeGuess() {
// Show the map for guessing
document.getElementById('streetView').style.display = 'none';
document.getElementById('mapPlaceholder').style.display = 'block';

// Listen for the map click event to get the guess location
map.addListener('click', function(mapsMouseEvent) {
    // Remove previous listener to prevent multiple guess submissions
    google.maps.event.clearListeners(map, 'click');

    // Show the guessed marker
    let guessMarker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: map,
        title: "Your Guess"
    });

    // Calculate distance between guess and actual location
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
        currentLocation, guessMarker.getPosition());

    // Convert distance to points and update the score
    updateScore(distance);

    // Prepare for the next round
    setTimeout(startNewRound, 3000); // Wait 3 seconds before starting the next round
});

}

function startNewRound() {
// Reset the map and panorama for the next round
currentLocation = getRandomLocation();
panorama.setPosition(currentLocation);
document.getElementById('streetView').style.display = 'block';
document.getElementById('mapPlaceholder').style.display = 'none';
panorama.setVisible(true);
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

// Initialize the game
initMap();