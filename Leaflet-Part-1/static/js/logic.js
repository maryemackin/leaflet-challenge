// Store the API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create an empty variable for myMap (to be defined later)
var myMap = L.map('map').setView([37.09, -95.71], 5);

// Add the base layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform a GET request to fetch the data
d3.json(queryUrl).then(function (data) {
  createMarkers(data.features);
});

function createMarkers(earthquakeData) {
  earthquakeData.forEach(function (feature) {
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2]; // Depth is the third coordinate

    // Calculate circle radius based on magnitude
    var radius = Math.sqrt(magnitude) * 5; // Adjust the multiplier as needed

    // Determine circle color based on depth
    var color;
    if (depth >= 90) color = "darkred";
    else if (depth >= 70) color = "red";
    else if (depth >= 50) color = "orange";
    else if (depth >= 30) color = "yellow";
    else if (depth >= 10) color = "lightgreen";
    else color = "green";

    // Create the circle marker
    var circle = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      radius: radius,
      fillColor: color,
      color: "white",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });

    // Add popup with earthquake information
    circle.bindPopup(`<strong>${feature.properties.place}</strong><br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);

    // Add the circle marker to the map
    circle.addTo(myMap);
  });

  // Create a combined legend for depth and magnitude
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
      <strong>Depth & Magnitude Legend</strong><br>
      <span style="background-color: darkred;">≥ 90 km</span><br>
      <span style="background-color: red;">70-89 km</span><br>
      <span style="background-color: orange;">50-69 km</span><br>
      <span style="background-color: yellow;">30-49 km</span><br>
      <span style="background-color: lightgreen;">10-29 km</span><br>
      <span style="background-color: green;">-10 to 9 km</span><br>
      <span style="font-size: 12px;">Circle size reflects magnitude</span>`;
    return div;
  };
  legend.addTo(myMap);
}
