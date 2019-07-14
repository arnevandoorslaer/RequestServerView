let song_list;
let search_list;

function ready() {
  song_list = $("#song_list");
  search_list = $("#search_list");
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
    if (e.keyCode == 13) {
      getSearchResult();
    }
  });
  search.append(searchTermInput);
}

function getSongs() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/song/all",
    success: function(json) {
      song_list.empty();
      var table_list = $(`<table class="table table-dark table-striped">`);
      table_list.append(`<th class="">NEXT UP: ` + json.length + ` SONGS</th>`);
      for (let i = 0; i < json.length; i++) {
        table_list.append(`
          <tr id="song">
          <td class="text-center"><strong>` + json[i].title + "</strong><br>" + json[i].artist + `</td>
          </tr>`);
      }
      song_list.append(table_list);
    },
    error: function() {
      song_list.empty();
      song_list.append("<p>Something went wrong...</p>");
    }
  });
  setTimeout(getSongs, 10000);
}

function getSearchResult() {
  let searchTerm = $("#searchTerm").val();
  if (searchTerm.length > 2) {
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/song/search/" + searchTerm,
      success: function(json) {
        console.log(json);
        search_list.empty();
        var table_list = $(`<table class="table table-hover table-dark table-striped">`);
        table_list.append(`<th class="">SEARCH RESULTS  Click to add song</th>`);
        for (let i = 0; i < json.length; i++) {
          console.log(json[i]);
          table_list.append(`
            <tr id="song" class="songcontainer" onclick="addSong('` + json[i].songId + `','` + json[i].title + `','` + json[i].artist + `')">
            <td class="text-center"><strong>` + json[i].title + "</strong><br>" + json[i].artist + `</td>
            </tr>`);
        }
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
                    }`
  $.ajax({
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Accept", "application/json");
    },
    url: "http://localhost:8080/song/add",
    type: "POST",
    datatype: "json",
    data: jsonString
  });
}
