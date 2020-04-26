const song_titles = [];
const song_ids = [];
const song_artists = [];
const ids = [];

collect();

function collect() {
    db.collection('song').orderBy('added').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(song => {
            if (song.type == 'added') add(song);
            if (song.type == 'removed') remove(song);
        });
    });
}

function add(song) {
    song_titles.push(song.doc.data().title);
    song_ids.push(song.doc.data().video_id);
    song_artists.push(song.doc.data().artist);
    ids.push(song.doc.id);
}

function remove(song) {
    removeA(song_titles, song.doc.data().title);
    removeA(song_ids, song.doc.data().video_id);
    removeA(song_artists, song.doc.data().artist);
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