let score = 0;
let panorama; // This will be the Street View panorama.
let map; // This will be the mini map.
let guessMarker; // Marker for the user's guess on the mini map.
let actualLocation; // The actual location of the street view.
let UBC_CAMPUS_COORDS = [{lat: 49.2606, lng: -123.2460}]; // We'll need more coordinates.

function initialize() {
  // Set the initial location for the Street View panorama to a random UBC campus location
  actualLocation = UBC_CAMPUS_COORDS[Math.floor(Math.random() * UBC_CAMPUS_COORDS.length)];
  
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: actualLocation,
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    }
  );

  // Set up the mini map.
  map = new google.maps.Map(document.getElementById("mini-map"), {
    center: actualLocation,
    zoom: 15,
  });

  // Allow the user to make a guess by placing a marker.
  map.addListener('click', function(mapsMouseEvent) {
    // If there's already a guess marker, remove it.
    if (guessMarker) {
      guessMarker.setMap(null);
    }

    // Place a new marker at the click location.
    guessMarker = new google.maps.Marker({
      position: mapsMouseEvent.latLng,
      map: map,
      title: "Your Guess"
    });
  });
}

// Function to calculate the distance between two coordinates in meters.
function calculateDistance(location1, location2) {
  const R = 6371e3; // metres
  const φ1 = location1.lat * Math.PI/180; // φ, λ in radians
  const φ2 = location2.lat * Math.PI/180;
  const Δφ = (location2.lat-location1.lat) * Math.PI/180;
  const Δλ = (location2.lng-location1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = "Score: " + score;
}

// Function to handle the guess and calculate the score.
function makeGuess() {
  if (!guessMarker) {
    alert('Please make a guess first!');
    return;
  }

  const guessedLocation = guessMarker.getPosition().toJSON();
  const distance = calculateDistance(actualLocation, guessedLocation);
  score = Math.max(0, 5000 - Math.round(distance / 10));
  updateScoreDisplay(); // Update the score on the page

  // Show the results menu here (we'll implement this next)
  showResultsMenu(distance);

  // Prepare for the next round (we'll implement rounds after results menu)
  prepareNextRound();
}

function showResultsMenu(distance) {
  document.getElementById("guess-distance").textContent = distance.toFixed(2);
  document.getElementById("results-menu").classList.remove("hidden");
}

function prepareNextRound() {
  // Hide the results menu
  document.getElementById("results-menu").classList.add("hidden");

  // Here you would reset the Street View to a new location
  // and clear the previous guess marker, but we'll implement that after rounds are added.
}

// Add the initialization function to the window object to be called when the Google Maps script is loaded.
window.initialize = initialize;
