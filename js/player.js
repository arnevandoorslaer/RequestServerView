var player;

//let ip = "193.191.177.8:10867";
let ip = "localhost:8080";
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
    url: "http://" + ip + "/song/" + type,
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
    url: "http://" + ip + "/song/skip",
    type: "GET",
    success: function(json) {
      if (json.length > 0) {
        currentId = json[0].songId;
        nowPlaying = currentId;
        player.loadVideoById(json[0].songId);
      } else {
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
