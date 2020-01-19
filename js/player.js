var player;
let currentId, nextId, currentFireBaseId;
let random_streams = ["taD9hqwCb1o", "hHW1oY26kxQ", "jnGUs3jCb_I", "Xmu8nWKykUw", "kGKkUN50R0c"];
let nowPlaying;
let songs = [];
let titles = [];

db.collection('song').orderBy('added').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
          let currentSong = change.doc.data();
          songs.push(currentSong.video_id);
          titles.push(currentSong.title);
        }
    });
    currentFireBaseId = changes[0].doc.id;
    $("#current").text(titles[0]);
    $("#next").text(titles[1]);
});

function skipSong() {
  songs.shift();
  titles.shift();
  db.collection('song').doc(currentFireBaseId).delete();
  nowPlaying = songs[0];
  player.loadVideoById(nowPlaying);
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
  nowPlaying = songs[0];
  console.log(nowPlaying);
  event.target.loadVideoById(nowPlaying);
}

function onError(event) {
  if (event.data == 150) {
    console.log("error");
    skipSong();
  }
  if (event.data == YT.PlayerState.PAUSED) {
    nowPlaying = songs[0];
    player.loadVideoById(nowPlaying);
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
