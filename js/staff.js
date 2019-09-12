let webSocket;
let name;
let message;
let score;
let song_list;
var rangeslider
let extra;

let ip = "http://www.arnevandoorslaer.ga:8080";
//ip = "http://localhost:8080";



function ready() {
  extra = $("#extra");
  song_list = $("#song_list");
  getSongs();

  openSocket();
  rangeslider = document.getElementById("sliderRange");
  rangeslider.oninput = function() {
    send(this.value);
  }
}


function openSocket() {
  webSocket = new WebSocket("ws://www.arnevandoorslaer.ga:8080/echo");

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

function getSongs() {
  $.ajax({
    type: "GET",
    url: ip + "/song/all",
    success: function(json) {
      fillSongList(json);
    },
    error: function() {
      extra.empty();
      extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
    }
  });
  setTimeout(getSongs, 5000);
}

function fillSongList(json) {
  song_list.empty();
  var table_list = $(`<table class="table table-dark table-striped">`);
  table_list.append(`<thead><th>NEXT UP: ` + json.length + ` SONGS</th></thead>`);
  var tbody = $("<tbody>");
  for (let i = 0; i < json.length; i++) {
    var tr = $(`
      <tr id="song">
      <td class="text-center">
      <img src="img/skip.png" onclick="skipSong(` + json[i].id + `)">
      <strong>` + json[i].title + "</strong><br>" + json[i].artist + `
        <i class="arrow up" onclick="moveUp('` + json[i].songId + `');"></i>
        <br>
        <i class="arrow down" onclick="moveDown('` + json[i].songId + `');"></i>
      </td>
      </tr>`);
    tbody.append(tr);
  }
  table_list.append(tbody);
  song_list.append(table_list);
}

function skipSong(id) {
  $.ajax({
    url: ip + "/song/skip/" + id + "/player",
    type: "GET",
    success: function(json) {
      song_list.empty();
      fillSongList(json);
    }
  });
}

function moveUp(id) {
  $.ajax({
    url: ip + "/song/up/" + id,
    type: "GET",
    success: function(json) {
      song_list.empty();
      fillSongList(json);
    }
  });
}

function moveDown(id) {
  $.ajax({
    url: ip + "/song/down/" + id,
    type: "GET",
    success: function(json) {
      song_list.empty();
      fillSongList(json);
    }
  });
}

function authenticate() {
  var key = $("#key").val();
  console.log(key);
  $.ajax({
    url: ip + "/authenticate/" + key,
    type: "GET",
    success: function(json) {
      extra.empty();
      if (json) {
        extra.append(`<div class="alert alert-success">AUTHENTICATED</div>`);
      } else {
        extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
      }
    }
  });
  setTimeout(fade_out, 2500);
}

function fade_out() {
  $("#extra").empty();
}
