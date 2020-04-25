let extra;
let key = "AIzaSyC5XqwePKeK-GkmPeAyjzhKbKc3lAdL89c";

db.collection('song').orderBy('added').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    console.log(change.doc)
    if (change.type == 'added') {
      $("#song_list_thead").removeAttr('hidden');
      displaySong(change.doc);
      displayUpNext();
    } else if (change.type == 'removed') {
      let tr = document.querySelector('#' + change.doc.id);
      console.log("removed " + change.doc.data().title);
      document.removeChild(tr);
    }
  });
});

function displaySong(song) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let tbody = document.querySelector('#song_list_body');
  tr.id = song.id;
  td.className = "text-center";
  td.innerHTML = "<strong>" + song.data().title + "</strong><br>" + song.data().artist;
  tr.append(td);
  tbody.appendChild(tr);
  console.log("added " + song.data().title);
}

function displayUpNext() {
  let thead = document.querySelector('#song_list_thead');
  db.collection('song').get().then(snap => {
    size = snap.size;
    thead.innerHTML = "NEXT UP: " + size + " SONGS";
  })
}

function displayResultText() {
  let thead = document.querySelector('#search_list_thead');
  db.collection('song').get().then(snap => {
    size = snap.size;
    thead.innerHTML = "SEARCH RESULTS  Click to add song";
  })
}

function displaySearchResult(id, title, artist) {
  displayResultText();
  let tbody = document.querySelector('#search_list_body');
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  td.className = "text-center";
  td.innerHTML = "<div onclick=\"addSong(\'" + id + "\',\'" + title + "\',\'" + artist + "\')\"> <strong>" + title + "</strong><br>" + artist + "</div>";
  tr.append(td);
  tbody.appendChild(tr);
}

function ready() {
  extra = $("#extra");
  createInput();
}

function createInput() {
  let search = $("#search");
  let searchTermInput = document.createElement("input");
  searchTermInput.className = "form-control";
  searchTermInput.name = "searchTerm";
  searchTermInput.type = "text";
  searchTermInput.id = "searchTerm";
  searchTermInput.placeholder = "What are you looking for?";
  searchTermInput.addEventListener('keyup', function (e) {
    let searchTerm = $("#searchTerm").val();
    if (e.keyCode == 13) {
      getSearchResult(searchTerm);
    }
  });
  search.append(searchTermInput);
}

function getSearchResult(searchTerm) {
  extra.empty();
  searchTerm = escapeHtml($("#searchTerm").val()).replace(" ", "%20");
  let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + key + "&maxResults=5&duration=short&q=" + searchTerm;
  if (searchTerm.length > 2) {
    $.ajax({
      type: "GET",
      url: url,
      success: function (json) {
        $("#search_list_thead").removeAttr('hidden');
        let songs = json.items;
        if (songs.length > 0) {
          for (let i = 0; i < songs.length; i++) {
            let id = songs[i].id.videoId;
            let title = unescapeHtml(songs[i].snippet.title);
            let artist = unescapeHtml(songs[i].snippet.channelTitle);
            displaySearchResult(id, title, artist);
          }
        }
      },
      error: function () {
        console.log(url);
        extra.empty();
        extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
      }
    });
  }
}

function addSong(id, title, artist) {
  db.collection('song').add({
    video_id: id,
    title: title,
    artist: artist,
    added: firebase.firestore.FieldValue.serverTimestamp()
  });
  extra.append(`<div class="alert alert-success">ADDED ` + title + `</div>`);
  setTimeout(fade_out, 5000);
  document.querySelector('#search_list_body').innerHTML = "";
  document.querySelector('#search_list_thead').innerHTML = "";
  $("#search_list_thead").hide();
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function unescapeHtml(unsafe) {
  return unsafe
    .replace("&amp;", "7")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&quot;", "\"")
    .replace("&#039;", "\'");
}

function fade_out() {
  $("#extra").empty();
}