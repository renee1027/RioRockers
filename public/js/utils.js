'use strict'

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
  
  var video = document.createElement("video");
  var canvasElement = document.getElementById("qrScanner");
  var canvas = canvasElement.getContext("2d");
  var loader = document.getElementById("loader");

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  // Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
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

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height);
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

window.setMapCenter = setMapCenter;
window.initQrScanner = initQrScanner;