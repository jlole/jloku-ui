import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Daily</Link>
        </li>
        <li>
          <Link to='/easy'>Easy</Link>
        </li>
        <li>
          <Link to='/medium'>Medium</Link>
        </li>
        <li>
          <Link to='/hard'>Hard</Link>
        </li>
        <li>
          <Link to='/extreme'>Extreme</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
