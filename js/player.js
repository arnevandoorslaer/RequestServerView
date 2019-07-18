var player;

let wan = "http://www.arnevandoorslaer.ga:8085";
let lan = "http://192.168.0.48:8085";
let ip = wan;
let host = location.host.split(":")[0];
if (host == "127.0.0.1" || host == "192.168.0.48") {
  ip = lan;
}

let random_streams = ["taD9hqwCb1o", "hHW1oY26kxQ", "jnGUs3jCb_I", "Xmu8nWKykUw", "kGKkUN50R0c"];

let currentId = getSong("current");
let nextId = getSong("next");
let nowPlaying;

function ready() {
  getCurrentAndNext();
}

function getCurrentAndNext() {
  getSong("current");
  getSong("next");
  setTimeout(getCurrentAndNext, 5000);
}

function getSong(type) {
  $.ajax({
    type: "GET",
    url: ip + "/song/" + type,
    success: function(json) {
      let p = $("#" + type);
      p.empty();
      p.append(json.title);
      if (type === "current") {
        currentId = json.songId;
        if (currentId != nowPlaying && nowPlaying != undefined) {
          location.reload(true);
        }
      } else if (type === "next") {
        nextId = json.songId;
      }
    }
  });
}

function skipSong() {
  $.ajax({
    url: ip + "/song/skip",
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
}

function check() {
  console.log("checking");
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
    playerVars: {
      'rel': 0,
      'autoplay': 1
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
