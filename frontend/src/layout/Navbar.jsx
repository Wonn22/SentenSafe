import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { navItems } from './navigation'
import './Navbar.css'

export function Navbar({ onOpenNotes }) {
  const location = useLocation()
  const navigate = useNavigate()
  const current = navItems.find((item) => item.to === location.pathname) || navItems[0]

  return (
    <header className="navbar">
      <div>
        <span className="eyebrow">SentenSafe workspace</span>
        <h1>{current.label}</h1>
      </div>
      <div className="nav-actions">
        <Button variant="secondary" onClick={() => navigate('/how-it-works')}>
          How it works
        </Button>
        <Button variant="ghost" onClick={onOpenNotes}>
          Usage notes
        </Button>
      </div>
    </header>
  )
}
