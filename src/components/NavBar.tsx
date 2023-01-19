import { NavLink } from 'react-router-dom';

const links = [
  {
    to: 'home',
    label: 'Home',
  },
  {
    to: 'player',
    label: 'Player',
  },
];

const NavBar = () => {
  return (
    <nav className='navbar bg-dark d-flex p-2'>
      <div className='d-flex'>
        {links &&
          links.map((link) => (
            <NavLink
              className='btn btn-dark mx-2 text-decoration-none text-white'
              to={link.to}
              key={link.to}
            >
              {link.label}
            </NavLink>
          ))}
      </div>
    </nav>
  );
};

export default NavBar;
