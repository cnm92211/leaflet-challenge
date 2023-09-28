// Store the API endpoint as a variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data from the API
d3.json(url).then(function(data) {

  // Create the map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Create the tile layer (background of the map)
var tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(myMap);


  // Define a function that will give each earthquake a color based on its depth
  function depthColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // Define a function to create the markers
  function createMarkers(feature, latlng) {
    var geojsonMarkerOptions = {
      radius: feature.properties.mag*4,
      fillColor: depthColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }

  // Create a GeoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: createMarkers,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
    }    
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);

});