let song_list;
let search_list;
let extra;
let songs = [];

let ip = "http://www.arnevandoorslaer.ga:8080";
//ip = "http://localhost:8080";


function ready() {
  song_list = $("#song_list");
  search_list = $("#search_list");
  extra = $("#extra");
  createInput();
  getSongs();
}

function createInput() {
  let search = $("#search");
  let searchTermInput = document.createElement("input");
  searchTermInput.className = "form-control";
  searchTermInput.name = "searchTerm";
  searchTermInput.type = "text";
  searchTermInput.id = "searchTerm";
  searchTermInput.placeholder = "What are you looking for?";
  searchTermInput.addEventListener('keyup', function(e) {
    let searchTerm = $("#searchTerm").val();
    if (e.keyCode == 13) {
      getSearchResult(searchTerm);
    }
    if (searchTerm.length == 0) {
      search_list.empty();
    }
  });
  search.append(searchTermInput);
}

function getSongs() {
  $.ajax({
    type: "GET",
    url: ip + "/song/all",
    success: function(json) {
      fillSongList(json);
    },
    error: function() {
      extra.empty();
      extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
    }
  });
  setTimeout(getSongs, 5000);
}

function getSearchResult(searchTerm) {
  extra.empty();
  searchTerm = $("#searchTerm").val();
  if (searchTerm.length > 2) {
    $.ajax({
      type: "GET",
      url: ip + "/song/search/" + searchTerm,
      success: function(json) {
        search_list.empty();
        var table_list = $(`<table class="table table-hover table-dark table-striped">`);
        table_list.append(`<thead><th>SEARCH RESULTS  Click to add song</th></thead>`);
        var tbody = $("<tbody>");
        for (let i = 0; i < json.length; i++) {
          tbody.append(`
            <tr id="song" class="songcontainer">
            <td class="text-center">
              <div onclick="addSong('` + json[i].songId + `','` + escapeHtml(json[i].title) + `','` + escapeHtml(json[i].artist) + `')">
                <strong>` + json[i].title + "</strong><br>" + json[i].artist + `
              </div>
              <input class="checkbox" type="checkbox" value="false" onclick="bulkAddArr('` + json[i].songId + `','` + escapeHtml(json[i].title) + `','` + escapeHtml(json[i].artist) + `')">
            </td>
            </tr>`);
        }
        tbody.append(`
          <tr id="song" class="songcontainer" onclick="bulkAdd();">
          <td class="text-center">
          BULK ADD
          </td>
          </tr>`);
        table_list.append(tbody);
        search_list.append(table_list);
      },
      error: function() {
        extra.empty();
        extra.append(`<div class="alert alert-danger">Something went wrong...</div>`);
      }
    });
  }
}

function bulkAddArr(songId, title, artist) {
  let temp = [songId, title, artist];
  var index = getIndex(temp, songs);
  if (index > -1) {
    songs.splice(index, 1);
  } else {
    songs.push(temp);
  }
}

function bulkAdd() {
  for (var i = songs.length - 1; i >= 0; i--) {
    addSong(songs[i][0], songs[i][1], songs[i][2]);
  }
}

function addSong(songId, title, artist) {
  let jsonString = `{"songId":"` + songId + `",
                    "title":"` + title + `",
                    "artist":"` + artist + `"
                  }`;
  $.ajax({
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Accept", "application/json");
    },
    url: ip + "/song/add",
    type: "POST",
    datatype: "json",
    data: jsonString,
    success: function(json) {
      search_list.empty();
      fillSongList(json);
      extra.append(`<div class="alert alert-success">ADDED ` + title + `</div>`);
    },
    error: function(json) {
      extra.append(`<div class="alert alert-danger">` + json.responseText + `</div>`);
    }
  });
  setTimeout(fade_out, 5000);
}

function fillSongList(json) {
  song_list.empty();
  var table_list = $(`<table class="table table-dark table-striped">`);
  table_list.append(`<thead><th>NEXT UP: ` + json.length + ` SONGS</th></thead>`);
  var tbody = $("<tbody>");
  for (let i = 0; i < json.length; i++) {
    var tr = $(`
      <tr id="song">
      <td class="text-center">
      <img src="img/skip.png" onclick="skipSong(` + json[i].id + `)">
      <strong>` + json[i].title + "</strong><br>" + json[i].artist + `</td>
      </tr>`);
    tbody.append(tr);
  }
  table_list.append(tbody);
  song_list.append(table_list);
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fade_out() {
  $("#extra").empty();
}


function skipSong(id) {
  $.ajax({
    url: ip + "/song/skip/" + id,
    type: "GET",
    success: function(json) {
      song_list.empty();
      fillSongList(json);
    }
  });
}

function getIndex(item, list) {
  for (var i = list.length - 1; i >= 0; i--) {
    if (list[i][0] == item[0]) {
      return i;
    }
  }
  return -1
}
