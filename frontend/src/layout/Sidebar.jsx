import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navItems } from './navigation'
import './Sidebar.css'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <img className="brand-mark" src={logo} alt="SentenSafe logo" />
        <div>
          <strong>SentenSafe</strong>
          <span>NLP pattern analysis</span>
        </div>
      </div>
      <nav className="side-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-note">Probability-based predictions. Not proof of authorship.</div>
    </aside>
  )
}
