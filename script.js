let map, streetView, panorama;
let currentScore = 0;
let currentRound = 1;
let guessMarker; 

const ubcCoordinates = { lat: 49.2606, lng: -123.2460 };

const ubcLocations = [
  { lat: 49.2609, lng: -123.2460 }, // UBC Bookstore
  { lat: 49.2683, lng: -123.2548 }, // UBC Botanical Garden
  { lat: 49.2611, lng: -123.2531 }, // Museum of Anthropology
  { lat: 49.2647, lng: -123.2520 }, // Nitobe Memorial Garden
  { lat: 49.2606, lng: -123.2399 }, // Wreck Beach Trail 6
  { lat: 49.2594, lng: -123.2452 }, // UBC Rose Garden
  { lat: 49.2663, lng: -123.2503 }, // Pacific Spirit Regional Park
  { lat: 49.2624, lng: -123.2420 }, // Chan Centre for the Performing Arts
  { lat: 49.2603, lng: -123.2454 }, // Irving K. Barber Learning Centre
  { lat: 49.2675, lng: -123.2593 }, // UBC Thunderbird Stadium
  { lat: 49.2684, lng: -123.2512 }, // UBC Aquatic Centre
  { lat: 49.2612, lng: -123.2384 }, // TRIUMF
  { lat: 49.2640, lng: -123.2583 }, // Doug Mitchell Thunderbird Sports Centre
  { lat: 49.2585, lng: -123.2356 }, // UBC Farm Centre
  { lat: 49.2596, lng: -123.2525 }, // Koerner Library
  { lat: 49.2633, lng: -123.2498 }, // War Memorial Gym
  { lat: 49.2600, lng: -123.2500 }, // UBC Student Nest
  { lat: 49.2644, lng: -123.2555 }, // Beaty Biodiversity Museum
  { lat: 49.2629, lng: -123.2391 }, // UBC Life Building
  { lat: 49.2618, lng: -123.2481 }, // Frederic Lasserre Building
  { lat: 49.2665, lng: -123.2534 }, // Wesbrook Village
  { lat: 49.2626, lng: -123.2558 }, // UBC Sauder School of Business
  { lat: 49.2608, lng: -123.2522 }, // UBC Allard School of Law
  { lat: 49.2641, lng: -123.2600 }, // UBC War Memorial Hall
  { lat: 49.2632, lng: -123.2553 }, // UBC Mathematics Building
  { lat: 49.2621, lng: -123.2532 }, // UBC Buchanan Building
  { lat: 49.2636, lng: -123.2474 }, // UBC Pharmaceutical Sciences Building
  { lat: 49.2604, lng: -123.2381 }, // UBC Centre for Interactive Research on Sustainability
  { lat: 49.2681, lng: -123.2564 }, // UBC Engineering Student Centre
  { lat: 49.2597, lng: -123.2430 }, // UBC Alumni Centre
  { lat: 49.2672, lng: -123.2524 }, // UBC School of Kinesiology
  { lat: 49.2623, lng: -123.2457 }, // UBC Earth Sciences Building
  { lat: 49.2615, lng: -123.2397 }, // UBC Robert H. Lee Alumni Centre
  { lat: 49.2605, lng: -123.2482 }, // UBC Brock Hall
  { lat: 49.2645, lng: -123.2461 }, // UBC Forestry Sciences Centre
  { lat: 49.2653, lng: -123.2599 }, // UBC School of Music
  { lat: 49.2692, lng: -123.2538 }, // UBC Norman Mackenzie House
  { lat: 49.2622, lng: -123.2594 }, // UBC St. John's College
  { lat: 49.2607, lng: -123.2527 }, // UBC Walter C. Koerner Library
  { lat: 49.2690, lng: -123.2565 }, // UBC Place Vanier Residence
  { lat: 49.2679, lng: -123.2433 }, // UBC Totem Park Residence
  { lat: 49.2638, lng: -123.2582 }, // UBC Martha Piper Plaza
  { lat: 49.2602, lng: -123.2449 }, // UBC Henry Angus Building
  { lat: 49.2688, lng: -123.2520 }, // UBC First Nations Longhouse
  { lat: 49.2620, lng: -123.2448 }, // UBC David Lam Management Research Library
];


function initGame() {
    map = new google.maps.Map(document.getElementById('map-view'), {
        center: ubcCoordinates,
        zoom: 15,
        streetViewControl: false, // Hide the default StreetView Pegman
        mapTypeControl: false // Hide the map type control
    });

    panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view'), {
          position: ubcCoordinates,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          disableDefaultUI: true, // Disable the default UI to hide controls
          showRoadLabels: false // Attempt to hide road labels if this option is available
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

    resetGame();
}

function calculateDistance(actualLocation, guessedLocation) {
  return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(actualLocation),
      new google.maps.LatLng(guessedLocation)
  );
}

function makeGuess() {

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
    showPointsEarned(scoreToAdd); 
    currentRound += 1;
    
    if (currentRound > 5) {
      showGameOverMenu();
      console.log('Game over should be shown now.');
  } else {
      updateLocation();
  }

    // Update the display
    document.getElementById('score-display').innerText = 'Score: ' + currentScore;
    document.getElementById('round-display').innerText = 'Round: ' + currentRound + '/5';


}
}

function showPointsEarned(points) {
  const pointsDiv = document.createElement('div');
  pointsDiv.classList.add('points-earned');
  pointsDiv.textContent = `+${points} / 100 Points!`;

  document.body.appendChild(pointsDiv);

  // Start the animation
  setTimeout(() => {
    pointsDiv.style.opacity = '1';
    pointsDiv.style.transform = 'translate(-50%, -50%)';
  }, 10); // Start after a very short delay to ensure the style is applied after insertion

  // Remove the element after the animation
  setTimeout(() => {
    pointsDiv.style.opacity = '0';
    pointsDiv.style.transform = 'translate(-50%, -100%)'; // Move up while fading out
  }, 1000); // Start fading out after 1 second

  // Clean up the element completely after the animation is done
  setTimeout(() => {
    pointsDiv.remove();
  }, 2000); // Remove after 2 seconds to allow for fade-out
}

function showGameOverMenu() {
  document.getElementById('game-over-menu').style.display = 'flex';
  document.getElementById('final-score').innerText = 'Final Score: ' + currentScore;
}

function restartGame() {
  resetGame();
  document.getElementById('game-over-menu').style.display = 'none';
}


function getRandomLocation() {
  const randomIndex = Math.floor(Math.random() * ubcLocations.length);
  return ubcLocations[randomIndex];
}

// Function to update the location for a new round
function updateLocation() {
    let newLocation = getRandomLocation();
    panorama.setPosition(newLocation);
}

// Function to reset the game
function resetGame() {
  if (!panorama) {
      // If panorama is not ready, don't try to reset the game yet.
      console.error("Panorama is not ready.");
      return;
  }

  currentScore = 0;
  currentRound = 1;
  updateLocation();
  // Update the display
  document.getElementById('score-display').innerText = 'Score: ' + currentScore;
  document.getElementById('round-display').innerText = 'Round: ' + currentRound + '/5';
}



// Call resetGame to start a new game
resetGame();
