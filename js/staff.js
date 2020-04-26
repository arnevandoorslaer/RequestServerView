let song_list;
var rangeslider
let extra;

window.onload = function () {
  extra = $("#extra");
  song_list = $("#song_list");

  rangeslider = document.getElementById("sliderRange");
  rangeslider.oninput = function () {
    if(this.value % 5 == 0){
      db.collection('volume').doc('u7b71I6LS48TfYqOcoi2').update( {volume : this.value} , /* onComplete */);
    }
  }
};

function skipSong() {
  db.collection('song').doc(ids[0]).delete();
}

function changeVolume(value){
  rangeslider.value = value;
  db.collection('volume').doc('u7b71I6LS48TfYqOcoi2').update( {volume : value} , /* onComplete */);
}

