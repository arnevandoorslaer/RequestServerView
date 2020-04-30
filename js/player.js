var player;
var random_streams = ["taD9hqwCb1o", "hHW1oY26kxQ", "jnGUs3jCb_I", "Xmu8nWKykUw", "kGKkUN50R0c"];

window.onload = function () {
  draw()
  setTimeout(draw, 1000);
};

db.collection('song').orderBy('added').onSnapshot(snapshot => {
  var length = ids.length;
  draw();
  snapshot.docChanges().forEach(song => {
    if (song.type == 'added') {
      if (length == 1) {
        player.loadVideoById(song_ids[0]);
      }
    }

    if (song.type == 'removed') {
      if (typeof song_ids[0] !== 'undefined' && song_ids[0] !== player.getVideoData().video_id) {
        player.loadVideoById(song_ids[0]);
      }
    }
  });
});

db.collection('control').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(control => {
    if(control.type == 'modified'){
      player.setVolume(control.doc.data().volume);
      pause(control.doc.data().paused);
    }
  });
});


async function skipSong() {
  await db.collection('song').doc(ids[0]).delete();
  draw();
  player.loadVideoById(song_ids[0]);
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

function onPlayerReady() {
  if (song_ids[0] !== undefined) {
    draw();
    player.loadVideoById(song_ids[0]);
  }
}

function onError(event) {
  if (event.data == 150) {
    skipSong();
  }
  if (event.data == YT.PlayerState.PAUSED) {
    if (song_ids[0] !== undefined) {
      draw();
      player.loadVideoById(getRandomStream());
    }
  }
  if (song_ids.length == 0) {
    player.loadVideoById("jnGUs3jCb_I");
  }

}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    skipSong();
  }

  if (event.data == YT.PlayerState.PLAYING) {
    db.collection('control').doc('RJ2Vest6fX5PldHj4u6V').update({
      paused: false
    }, /* onComplete */ );
  }
}

function getRandomStream() {
  return random_streams[Math.floor(Math.random() * random_streams.length)];
}

function draw() {
  $("#current").text("");
  $("#next").text("");
  try {
    $("#current").text(unescapeHtml(song_titles[0]));
  } catch (E) {
    $("#current").text("");
  }
  try {
    $("#next").text(unescapeHtml(song_titles[1]));
  } catch (E) {
    $("#next").text("");
  }
}

function pause(value) {
  if (value) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}