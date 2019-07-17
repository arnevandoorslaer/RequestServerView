let song_list;
let search_list;
let extra;



let wan = "http://arnevandoorslaer.ga:8080";
let lan = "http://192.168.0.48:8080";
let local = "http://localhost:8080";
let ip = wan;

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
      song_list.empty();
      song_list.append("<p>Something went wrong...</p>");
    }
  });
  setTimeout(getSongs, 10000);
}

function getSearchResult(searchTerm) {
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
            <tr id="song" class="songcontainer" onclick="addSong('` + json[i].songId + `','` + escapeHtml(json[i].title) + `','` + escapeHtml(json[i].artist) + `')">
            <td class="text-center"><strong>` + json[i].title + "</strong><br>" + json[i].artist + `</td>
            </tr>`);
        }
        table_list.append(tbody);
        search_list.append(table_list);
      },
      error: function() {
        search_list.empty();
        search_list.append("<p>Something went wrong...</p>");
      }
    });
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
      console.log(json);
      search_list.empty();
      fillSongList(json);
      extra.append(`<div class="alert alert-success">ADDED ` + title + `</div>`);
    },
    error: function(json) {
      extra.append(`<div class="alert alert-danger">` + json.responseText + `</div>`);
    }
  });

  setTimeout(fade_out, 5000);

  function fade_out() {
    $("#extra").empty();
  }
}

function fillSongList(json) {
  song_list.empty();
  var table_list = $(`<table class="table table-dark table-striped">`);
  table_list.append(`<thead><th>NEXT UP: ` + json.length + ` SONGS</th></thead>`);
  var tbody = $("<tbody>");
  for (let i = 0; i < json.length; i++) {
    tbody.append(`
      <tr id="song">
      <td class="text-center"><strong>` + json[i].title + "</strong><br>" + json[i].artist + `</td>
      </tr>`);
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

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
