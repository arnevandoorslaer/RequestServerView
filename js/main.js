let extra;
const key = "AIzaSyC5XqwePKeK-GkmPeAyjzhKbKc3lAdL89c";

window.onload = function () {
  extra = $("#extra");
  createInput();
  setTimeout(draw, 1000);
};

db.collection('song').onSnapshot(snapshot => draw());

function draw() {
  $("#song_list_body").empty();
  $("#song_list_thead").removeAttr('hidden');
  displayUpNext();
  for (let i = 0; i < ids.length; i++) {
    var title = song_titles[i];
    var artist = song_artists[i];
    var id = song_ids[i];

    displaySong(title, artist, id);
  }
}

function displaySong(title, artist, id) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let tbody = document.querySelector('#song_list_body');
  tr.id = id;
  td.className = "text-center";
  td.innerHTML = "<strong>" + title + "</strong><br>" + artist;
  tr.append(td);
  tbody.appendChild(tr);
}

function displayUpNext() {
  let thead = document.querySelector('#song_list_thead');
  thead.innerHTML = "NEXT UP: " + ids.length + " SONGS";
}

function displayResultText() {
  let thead = document.querySelector('#search_list_thead');
  thead.innerHTML = "SEARCH RESULTS  Click to add song";
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
  let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=" + key + "&maxResults=5&duration=short&q=" + searchTerm;
  if (searchTerm.length > 2) {
    $.ajax({
      type: "GET",
      url: url,
      success: function (json) {
        $("#search_list_thead").removeAttr('hidden');
        let songs = json.items;
        if (songs.length > 0) {
          for (const song of songs) {
            if (song.snippet.liveBroadcastContent !== "live" && !song_ids.includes(song.id.videoId)) {
              let id = song.id.videoId;
              let title = unescapeHtml(song.snippet.title);
              let artist = unescapeHtml(song.snippet.channelTitle);
              displaySearchResult(id, title, artist);
            }
          }
        }
      },
      error: function () {
        extra.empty();
        extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
      }
    });
  }
}

async function addSong(id, title, artist) {
  await db.collection('song').add({
    video_id: id,
    title: title,
    artist: artist,
    added: firebase.firestore.FieldValue.serverTimestamp()
  });
  extra.append(`<div class="alert alert-success">ADDED ` + title + `</div>`);
  draw();
  setTimeout(fade_out, 5000);
  $('#search_list_body').empty();
  $('#search_list_thead').empty();
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