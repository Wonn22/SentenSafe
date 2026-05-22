import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Dialog } from '../components/Dialog'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import './AppLayout.css'

export function AppLayout() {
  const [notesOpen, setNotesOpen] = useState(false)

  return (
    <div className="app-frame">
      <Sidebar />
      <main className="main-shell">
        <Navbar onOpenNotes={() => setNotesOpen(true)} />
        <div className="content-shell">
          <Outlet />
        </div>
      </main>
      <Dialog open={notesOpen} title="Usage notes" onClose={() => setNotesOpen(false)}>
        <p>
          SentenSafe reports likely writing patterns from the current NLP model. It should
          support review workflows, not act as definitive authorship proof.
        </p>
      </Dialog>
    </div>
  )
}
