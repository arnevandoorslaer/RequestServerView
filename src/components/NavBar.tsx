import { NavLink } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const links = [
  {
    to: '',
    label: 'Home',
  },
  {
    to: 'player',
    label: 'Player',
  },
];

const NavBar = () => {
  const { user, logOut, authorized } = useUser();

  return (
    <header>
      <nav className='navbar bg-dark d-flex p-2'>
        <div className='d-flex'>
          {links &&
            links.map((link) => (
              <NavLink
                className='btn btn-dark m-2 text-white'
                to={link.to}
                key={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          {authorized && (
            <NavLink
              className='btn btn-dark m-2 text-white'
              to='staff'
              key='staff'
            >
              Staff
            </NavLink>
          )}
        </div>
        {user && (
          <button className='btn btn-danger m-2' onClick={logOut}>
            Logout
          </button>
        )}
        {!user && (
          <NavLink
            className='btn btn-dark m-2 text-white'
            to='login'
            key='login'
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
