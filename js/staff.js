let webSocket;
let name;
let message;
let score;
let song_list;
var rangeslider
let extra;

function ready() {
  extra = $("#extra");
  song_list = $("#song_list");

  rangeslider = document.getElementById("sliderRange");
  rangeslider.oninput = function () {
    console.log(this.value);
    //send(this.value);
  }
}

function skipSong(id) {
  db.collection('song').doc(ids[0]).delete();
}