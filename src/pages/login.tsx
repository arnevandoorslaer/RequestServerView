import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';

export default function Login() {
  const { user, logIn, error } = useUser();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <main className='container text-center'>
      <form className='form m-5'>
        <label className='form-label text-white'>E-mail</label>
        <input
          className='form-control'
          type='text'
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <label className='form-label text-white mt-5'>Password</label>
        <input
          className='form-control'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        {!user && (
          <button
            className='btn btn-dark m-1 mt-5'
            onClick={() => {
              if (username && password) logIn(username, password);
            }}
          >
            Login
          </button>
        )}
      </form>
    </main>
  );
}
