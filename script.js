let map, streetView, panorama;
let currentScore = 0;
let currentRound = 1;
let guessMarker; 

// Placeholder for UBC campus coordinates
const ubcCoordinates = { lat: 49.2606, lng: -123.2460 };

function initGame() {
    map = new google.maps.Map(document.getElementById('map-view'), {
        center: ubcCoordinates,
        zoom: 15,
        streetViewControl: false, // Hide the default StreetView Pegman
        mapTypeControl: false // Hide the map type control
    });

    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
            position: ubcCoordinates,
            pov: { heading: 165, pitch: 0 },
            zoom: 1
        }
    );

    // Set the StreetView panorama into the map
    map.setStreetView(panorama);

    // Add click listener to map for placing/moving the guess marker
    map.addListener('click', function(mapsMouseEvent) {
      if (!guessMarker) {
          // Create a new marker if it doesn't exist
          guessMarker = new google.maps.Marker({
              position: mapsMouseEvent.latLng,
              map: map,
              draggable: true
          });
      } else {
          // Move the existing marker to the new location
          guessMarker.setPosition(mapsMouseEvent.latLng);
      }
  });

    // Event listener for the guess button
    document.getElementById('guess-button').addEventListener('click', makeGuess);
}

function calculateDistance(actualLocation, guessedLocation) {
  return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(actualLocation),
      new google.maps.LatLng(guessedLocation)
  );
}

function makeGuess() {
    // Placeholder function for making a guess
    alert('Guess made!');

    if (!guessMarker) {
      alert('Please place your guess on the map first!');
      return;
  }

  const confirmGuess = confirm('Are you sure about your guess?');
  if (confirmGuess) {

    const guessedLocation = guessMarker.getPosition();
    const actualLocation = panorama.getPosition();
    const distance = calculateDistance(actualLocation, guessedLocation);

    // You would add logic here to compare the guess to the actual location
    // Update the score and round info
    const scoreToAdd = Math.max(0, 100 - Math.round(distance / 10));
    currentScore += scoreToAdd;
    currentRound += 1; // Move to the next round

    // Update the display
    document.getElementById('score-display').innerText = 'Score: ' + currentScore;
    document.getElementById('round-display').innerText = 'Round: ' + currentRound + '/5';

    // Logic to move to the next location or end the game would go here
}
}

// Placeholder function to pick a random location on the UBC campus
function getRandomLocation() {
    // Logic to get a random location would go here
    return ubcCoordinates; // Placeholder return
}

// Function to update the location for a new round
function updateLocation() {
    let newLocation = getRandomLocation();
    panorama.setPosition(newLocation);
}

// Function to reset the game
function resetGame() {
    currentScore = 0;
    currentRound = 1;
    updateLocation();
    // Update the display
    document.getElementById('score-display').innerText = 'Score: ' + currentScore;
    document.getElementById('round-display').innerText = 'Round: ' + currentRound + '/5';
}

// Call resetGame to start a new game
resetGame();
