let webSocket;
let name;
let message;
let score;
var rangeslider


function ready() {
  openSocket();
  rangeslider = document.getElementById("sliderRange");
  rangeslider.oninput = function() {
    send(this.value);
  }
}


function openSocket() {
  webSocket = new WebSocket("ws://192.168.0.48:8080/echo");

  webSocket.onopen = function(event) {
    webSocket.send("open");
  };

  webSocket.onmessage = function(event) {
    writeResponse(event.data);
  };
}

function send(message) {
  webSocket.send(message);
}

function writeResponse(text) {
  rangeslider.value = text;
}
