import { atom } from 'jotai'
import { Song } from '../model/song';

export const songSearch = atom('');

export const songSearchList = atom([]);

export const searchError = atom(null);

export const selectedSongAtom = atom<Song | null>(null)

export const songList = atom<Song[]>([]);

export const controlList = atom<any[]>([])