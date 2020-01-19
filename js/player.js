var player;
let currentId;
let nextId;

let currentFireBaseId;
db.collection('song').orderBy('added').limit(2).onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    currentFireBaseId = changes[0].doc.id;
    currentId = changes[0].doc.data().video_id;
    nextId = changes[1].doc.data().video_id;
    $("#current").text(changes[0].doc.data().title);
    $("#next").text(changes[1].doc.data().title);
});

let random_streams = ["taD9hqwCb1o", "hHW1oY26kxQ", "jnGUs3jCb_I", "Xmu8nWKykUw", "kGKkUN50R0c"];
let nowPlaying;

function skipSong() {
  db.collection('song').doc(currentFireBaseId).delete();
  nowPlaying = currentId;
  player.loadVideoById(currentId);
}

/*function skipSong() {
  $.ajax({
    url: ip + "/song/skip/player",
    type: "GET",
    success: function(json) {
      if (json.length > 0) {
        currentId = json[0].songId;
        nowPlaying = currentId;
        player.loadVideoById(json[0].songId);
      } else {
        player.loadVideoById(getRandomStream());
        check();
      }
    }
  });
}*/

function check() {
  getSong("current");
  if (currentId == "none") {
    setTimeout(check, 2000);
  } else {
    nowPlaying = currentId;
    player.loadVideoById(currentId);
  }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: 600,
    height: 400,
    playerVars: {
      'rel': 0,
      'autoplay': 1,
      'enablejsapi': 1,
      'origin': 'https://127.0.0.1:3000'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onError
    }
  });
}

function onPlayerReady(event) {
  nowPlaying = currentId;
  event.target.loadVideoById(currentId);
}

function onError(event) {
  if (event.data == 150) {
    skipSong();
  }
  if (event.data == YT.PlayerState.PAUSED) {
    nowPlaying = currentId;
    player.loadVideoById(currentId);
  }
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    skipSong();
  }
}

function getRandomStream() {
  return random_streams[Math.floor(Math.random() * random_streams.length)];
}
