import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { songFirestore } from '../firebase/config'

const useUser = () => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  const signUp = (username: string, password: string) => {
    if (username && password) {
      createUserWithEmailAndPassword(auth, username, password).catch((e) => {
        setError(e.message);
      });
    }
  };

  const logIn = (username: string, password: string) => {
    if (username && password) {
      signInWithEmailAndPassword(auth, username, password).catch((e) => {
        setError(e.message);
      });
    }
  };

  const logOut = () => {
    signOut(auth).catch((e) => {
      setError(e.message);
    });
  };

  const authorized = !!user;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
  }, []);

  return { user, error, authorized, logIn, logOut, signUp };
};

export { useUser };
