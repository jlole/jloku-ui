import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to='/'>Daily</Link>
        </li>
        <li className={location.pathname === '/easy' ? 'active' : ''}>
          <Link to='/easy'>Easy</Link>
        </li>
        <li className={location.pathname === '/medium' ? 'active' : ''}>
          <Link to='/medium'>Medium</Link>
        </li>
        <li className={location.pathname === '/hard' ? 'active' : ''}>
          <Link to='/hard'>Hard</Link>
        </li>
        <li className={location.pathname === '/extreme' ? 'active' : ''}>
          <Link to='/extreme'>Extreme</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
