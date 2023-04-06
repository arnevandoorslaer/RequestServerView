import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchError, songSearch, songSearchList } from '../services/songStore';

const key = 'AIzaSyC5XqwePKeK-GkmPeAyjzhKbKc3lAdL89c';

const SearchBar = () => {
  const [input, setInput] = useAtom(songSearch);
  const [, setError] = useAtom(searchError);
  const [, setSongs] = useAtom(songSearchList);

  const submit = () => {
    let url = new URL(
      'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' +
        key +
        '&maxResults=5&duration=short&q=' +
        input,
    ).toString();

    if (input.length > 2) {
      fetch(url)
        .then((res) => res.json())
        .then(
          (result) => {
            const songs = result.items.map((item) => ({
              video_id: item.id.videoId,
              title: item.snippet.title,
              artist: item.snippet.channelTitle,
            }));
            setSongs(songs);
            setInput('');
          },
          (error) => {
            setError(error);
          },
        );
    }
  };

  return (
    <div
      className='input-group input-group-lg mt-3 mb-4 border border-dark rounded'
      id='search'
    >
      <button
        type='submit'
        onClick={submit}
        className='btn btn-dark list-group'
      >
        <FontAwesomeIcon icon={faSearch} className='input-group-text' />
      </button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='form-control form-control-plaintext'
        name='searchTerm'
        type='text'
        id='searchTerm'
        placeholder='What are you looking for?'
        onKeyDown={(e) => {
          if (e.code === 'Enter') submit();
        }}
      />
    </div>
  );
};

export default SearchBar;
