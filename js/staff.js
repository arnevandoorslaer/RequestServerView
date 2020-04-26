let song_list;
var rangeslider
let extra;
let paused;

db.collection('control').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(control => {
    paused = control.doc.data().paused;
    document.getElementById("paused").value = paused ? "UNPAUSE" : "PAUSE";
  });
});

window.onload = function () {
  extra = $("#extra");
  song_list = $("#song_list");

  rangeslider = document.getElementById("sliderRange");
  rangeslider.oninput = function () {
    if(this.value % 5 == 0){
      db.collection('volume').doc('RJ2Vest6fX5PldHj4u6V').update( {volume : this.value} , /* onComplete */);
    }
  }
};

function skipSong() {
  db.collection('song').doc(ids[0]).delete();
}

function changeVolume(value){
  rangeslider.value = value;
  db.collection('control').doc('RJ2Vest6fX5PldHj4u6V').update( {volume : value} , /* onComplete */);
}

function pause(){
  document.getElementById("paused").value = paused ? "UNPAUSE" : "PAUSE";
  db.collection('control').doc('RJ2Vest6fX5PldHj4u6V').update( {paused : !paused} , /* onComplete */);
}

