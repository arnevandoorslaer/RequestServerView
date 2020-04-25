var player;
var random_streams = ["taD9hqwCb1o", "hHW1oY26kxQ", "jnGUs3jCb_I", "Xmu8nWKykUw", "kGKkUN50R0c"];
var song_titles = [];
var song_ids = [];
var ids = [];

collect();

function collect() {
  db.collection('song').orderBy('added').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(song => {
      if (song.type == 'added') add(song);
      if (song.type == 'removed') remove(song);
    });
    draw();
  });
}


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
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    skipSong();
  }
}

function getRandomStream() {
  return random_streams[Math.floor(Math.random() * random_streams.length)];
}

function draw() {
  try {
    $("#current").text(song_titles[0]);
  } catch (E) {
    $("#current").text("");
  }
  try {
    $("#next").text(song_titles[1]);
  } catch (E) {
    $("#next").text("");
  }
}


function add(song) {
  song_titles.push(song.doc.data().title);
  song_ids.push(song.doc.data().video_id);
  ids.push(song.doc.id);
}

function remove(song) {
  removeA(song_titles, song.doc.data().title);
  removeA(song_ids, song.doc.data().video_id);
  removeA(ids, song.doc.id);
}

function removeA(arr) {
  var what, a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}