'use strict'

var map;

function generateLocationContent(locationInfo) {
  let locationElem = $('#locationRootElem .location-info-container').clone();
  locationElem.attr('id', 'location_' + locationInfo.id);
  locationElem.find('.location-title').text(locationInfo.name);
  locationElem.find('.address').text(locationInfo.address);
  locationElem.find('.popularityByTime').attr('id', 'chart' + locationInfo.id);
  locationInfo.Ramps.map(function (ramp, index) {
    let rampElem = $('#rampRootElem .ramp-container').clone();
    rampElem.attr('id', 'ramp_' + ramp.id);
    let rampNum = index + 1;
    rampElem.find('.rampNumber').text('Ramp ' + rampNum);
    let status = rampElem.find('.status');
    let waitingBtnFlag = false;
    let waitingListBtn = rampElem.find('.add-to-waiting-list')
                        .attr('onclick', 'addToWaitingList(' + ramp.id + '); return false');
    let numPeopleWaiting = rampElem.find('.numPeopleWaiting').attr('id', 'waitingList_' + ramp.id);
    if (ramp.occupiedSince) {
      waitingBtnFlag = true;
      status.addClass('font-bright-red');
      status.find('h7').text('Occupied');
      let duration = moment.duration(moment().diff(ramp.occupiedSince));
      duration = duration.asHours().toFixed(1);
      duration = duration == '0.0' ? 'Just Now, ' : 'For ' + duration + ' hours, ';
      rampElem.find('.occupiedSince').text(duration);
    } else {
      waitingBtnFlag = ramp.waitingList > 0 ? true : false;
      status.addClass('font-green');
      status.find('h7').text('Free');
    }

    waitingBtnFlag && numPeopleWaiting.text(ramp.waitingList + ' people waiting');
    !waitingBtnFlag && waitingListBtn.hide();

    rampElem.appendTo(locationElem);
  });
  return locationElem.html();
}

function addToWaitingList(rampId) {
  $.ajax({
    url: '/addToWaitingList/' + rampId,
    type: 'POST',
    crossDomain: true,
    data: { _csrf : csrftoken },
    success: function(data) {
      $('#waitingList_' + rampId).text(data.count + ' people waiting');
    }
  });
}

function generateTimeBarChart(locationId) {
  var chart = c3.generate({
    bindto: '#chart' + locationId,
    size: {
      height: 200,
      width: 200
    },
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
  });
}

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  let locationMarker;
  let locationInfoWindow;
  let content;

  locations.map(function (location) {
    content = generateLocationContent(location);
    locationMarker = new google.maps.Marker({
      position: {
        lat: location.lat,
        lng: location.lng
      },
      map: map,
      title: location.name
    });

    locationInfoWindow = new google.maps.InfoWindow({
      backgroundColor: 'rgba(62, 62, 62, 0.9)',
      borderWidth: 0
    });

    google.maps.event.addListener(locationMarker, 'click', (function (marker, content, locationInfoWindow) {
      return function () {
        locationInfoWindow.setContent(content);
        locationInfoWindow.open(map, this);
        generateTimeBarChart(location.id);
      };
    })(locationMarker, content, locationInfoWindow));
  })

  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    let places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      let icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  setMapCenter(map);
  resizeMap();
}

function resizeMap() {
  let height = $(window).height() - 67.5;
  $('.map-container').css({
    height: height
  });
}

function setMapCenter(map) {
  try {
    navigator.geolocation.getCurrentPosition(function (position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    });
  } catch (error) {
    throw new Error(error);
  }
}

function initQrScanner() {

  let video = document.createElement("video");
  let canvasElement = document.getElementById("qrScanner");
  let boxOverlay = document.getElementById("boxOverlay");
  let canvas = canvasElement.getContext("2d");
  let loader = document.getElementById("loader");

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  // Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment"
    }
  }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.setAttribute("controls", isSafari);
    video.play();
    setTimeout(() => {
      video.removeAttribute("controls");
    });
    requestAnimationFrame(tick);
  });

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      loader.hidden = true;
      canvasElement.hidden = false;
      boxOverlay.hidden = false;

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      let code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && !codeScanned) {
        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
        $('#qrScanner').trigger('scanned', [code.data]);
      }
    }
    requestAnimationFrame(tick);
  }

}

window.initQrScanner = initQrScanner;
window.resizeMap = resizeMap;
window.initAutocomplete = initAutocomplete;