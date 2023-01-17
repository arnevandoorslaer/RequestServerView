import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

firebase.initializeApp({
  apiKey: 'AIzaSyDB6qqS74epkqLD6unepTq1mCygYG1aPA4',
  authDomain: 'songrequest-246613.firebaseapp.com',
  databaseURL: 'https://songrequest-246613.firebaseio.com',
  projectId: 'songrequest-246613',
  storageBucket: 'songrequest-246613.appspot.com',
  messagingSenderId: '727709270985',
  appId: '1:727709270985:web:a47c75d211da10da9c9e18',
  measurementId: 'G-100748LHW0',
});

const firestore = firebase.firestore();
const songsRef = firestore.collection('song');
const query: any = songsRef.orderBy('added');

const key = 'AIzaSyC5XqwePKeK-GkmPeAyjzhKbKc3lAdL89c';

function App() {
  const [songs] = useCollectionData(query);

  return (
    <main className='container'>
      <SearchBar />
      <SongTable songs={songs} showHead />
    </main>
  );
}

function SearchBar() {
  interface StateTypes {
    value: string;
    songs: Song[];
  }

  const [state, setState] = useState<StateTypes>({
    value: '',
    songs: [],
  });

  const handleChange = (e) => {
    setState({ ...state, value: e.target.value });
  };

  const submit = () => {
    let url = new URL(
      'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' +
        key +
        '&maxResults=5&duration=short&q=' +
        state.value,
    ).toString();

    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const songs = result.items.map((item) => ({
            video_id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
          }));
          setState({ value: '', songs });
        },
        (error) => {
          console.log('oei');
        },
      );
  };

  const searchBar = (
    <div className='input-group' id='search'>
      <button type='submit' className='input-group-btn' onClick={submit}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <input
        value={state.value}
        onChange={handleChange}
        className='form-control'
        name='searchTerm'
        type='text'
        id='searchTerm'
        placeholder='What are you looking for?'
        onKeyDown={(e) => {
          if (e.code === 'Enter') submit();
        }}
      />{' '}
    </div>
  );

  return (
    <>
      {searchBar}
      {state.songs && <SongTable songs={state.songs} showHead={false} />}
    </>
  );
}

function SongTable({ songs, showHead = true }) {
  return (
    <>
      <table className='table table-striped table-dark'>
        {showHead && <SongTableHead songs={songs} />}
        <SongTableBody songs={songs} />
      </table>
    </>
  );
}

function SongTableHead({ songs }) {
  return (
    <>
      {songs && songs?.length && songs?.length > 0 && (
        <thead>
          <tr>
            <th>NEXT UP: {songs?.length} songs</th>
          </tr>
        </thead>
      )}
    </>
  );
}

function SongTableBody({ songs }) {
  return (
    <tbody>
      {songs &&
        songs.map((song) => (
          <tr key={song.video_id}>
            <td className='text-center'>
              <strong>{song.title}</strong>
              <br />
              {song.artist}
            </td>
          </tr>
        ))}
    </tbody>
  );
}

export interface Song {
  video_id: string;
  title: string;
  artist: string;
}

export default App;
