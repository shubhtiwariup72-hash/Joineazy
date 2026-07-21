import React from 'react'
import './Header.css'

const Header = ({ navData }) => {
  return (
    <header className='header-container'>
      <div className='header-left'>
        <a href="#Home" className="logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">Devesh</span>
          <span className="logo-bracket"> /&gt;</span>
        </a>
      </div>
      <nav className='header-right'>
        <ul>
          {navData.map((item) => (
            <li key={item.id}>
              <a href={item.path} className="nav-link">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header