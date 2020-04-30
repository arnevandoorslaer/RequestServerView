let extra;
const key = "AIzaSyC5XqwePKeK-GkmPeAyjzhKbKc3lAdL89c";

window.onload = function () {
  extra = $("#extra");
  setTimeout(draw, 1000);
  setTimeout(createInput, 500);
};

db.collection('song').onSnapshot(() => draw());

function draw() {
  $("#song_list_body").empty();
  $("#song_list_thead").removeAttr('hidden');
  displayUpNext();
  for (let i = 0; i < ids.length; i++) {
    var id = song_ids[i];
    var title = song_titles[i];
    var artist = song_artists[i];
    displaySong(id, title, artist);
  }
}

function displaySong(id, title, artist) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let tbody = document.querySelector('#song_list_body');
  let tdiv = document.createElement("div");
  let ttitle = document.createElement("strong");
  td.className = "text-center";
  ttitle.textContent = unescapeHtml(title);
  tdiv.append(ttitle);
  tdiv.append(document.createElement("br"));
  tdiv.append(unescapeHtml(artist));
  td.append(tdiv);
  tr.append(td);
  tbody.appendChild(tr);
}

function displaySearchResult(id, title, artist) {
  displayResultText();
  let tbody = document.querySelector('#search_list_body');
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let tdiv = document.createElement("div");
  let ttitle = document.createElement("strong");
  td.className = "text-center";
  tdiv.addEventListener("click", () => addSong(id, title, artist));
  ttitle.textContent = unescapeHtml(title);
  tdiv.append(ttitle);
  tdiv.append(document.createElement("br"));
  tdiv.append(unescapeHtml(artist));
  td.append(tdiv);
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
  $('#search_list_body').empty();
  searchTerm = escape($("#searchTerm").val()).replace(" ", "%20");
  let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=" + key + "&maxResults=5&duration=short&q=" + searchTerm;
  if (searchTerm.length > 2) {
    $.ajax({
      type: "GET",
      url: url,
      success: function (json) {
        $("#search_list_thead").removeAttr('hidden');
        let songs = json.items;
        if (songs.length > 0) {
          console.log(song_ids);
          for (const song of songs) {
            console.log(song.id.videoId);
            if (song.snippet.liveBroadcastContent !== "live" && !song_ids.includes(song.id.videoId)) {
              var id = song.id.videoId;
              var title = song.snippet.title;
              var artist = song.snippet.channelTitle;
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
    .split(/&/g).join("&amp;")
    .split(/</g).join("&lt;")
    .split(/>/g).join("&gt;")
    .split(/"/g).join("&quot;")
    .split(/'/g).join("&#39;");
}

function unescapeHtml(unsafe) {
  return unsafe
    .split("&amp;").join("7")
    .split("&lt;").join("<")
    .split("&gt;").join(">")
    .split("&quot;").join("\"")
    .split("&#39;").join("\'");
}

function fade_out() {
  $("#extra").empty();
}