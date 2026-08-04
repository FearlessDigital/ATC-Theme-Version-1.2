/**
 * Truffle Map - Google Maps Integration
 * Displays favorable truffle climate locations on a map
 */

(function() {
  'use strict';

  window.TruffleMap = window.TruffleMap || {};

  /**
   * Initialize a truffle map instance
   * @param {Object} config - Configuration object
   * @param {string} config.mapId - DOM element ID for the map
   * @param {string} config.markerImage - URL for custom marker icon
   * @param {string} config.dataUrl - URL to fetch location data
   * @param {number} config.centerLat - Map center latitude
   * @param {number} config.centerLng - Map center longitude
   * @param {number} config.zoomLevel - Initial zoom level
   */
  window.TruffleMap.init = function(config) {
    var mapCenter = {
      lat: config.centerLat,
      lng: config.centerLng
    };

    var map = new google.maps.Map(document.getElementById(config.mapId), {
      zoom: config.zoomLevel,
      center: mapCenter
    });

    if (config.dataUrl) {
      fetch(config.dataUrl)
        .then(function(response) {
          return response.text();
        })
        .then(function(data) {
          var parsedData = JSON.parse(atob(data.replace(/(\r\n|\n|\r)/gm, "")));
          addMarkers(map, parsedData, config.markerImage);
        })
        .catch(function(error) {
          console.error('Error loading truffle map data:', error);
        });
    }
  };

  /**
   * Add markers to the map
   * @param {google.maps.Map} map - Google Maps instance
   * @param {Array} cities - Array of location data
   * @param {string} markerImage - URL for marker icon
   */
  function addMarkers(map, cities, markerImage) {
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      var color = city["color"];
      var image = null;

      if (color === "GREEN" && markerImage) {
        image = markerImage;
      }

      if (image) {
        var pos = {
          lat: parseFloat(city["Lat"]),
          lng: parseFloat(city["Long"])
        };

        new google.maps.Marker({
          position: pos,
          map: map,
          title: city["longname"],
          icon: image
        });
      }
    }
  }
})();
