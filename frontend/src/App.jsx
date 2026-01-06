import { useEffect, useState } from 'react'
import './App.css'
import CommentList from './components/CommentList.jsx'
import CommentForm from './components/CommentForm.jsx'
import { fetchComments, addComment, editComment, deleteComment } from './services/api.js'

function App() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchComments()
      setComments(data)
    } catch (err) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Close on Escape when overlay is open
  useEffect(() => {
    if (!formOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') setFormOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [formOpen])

  const handleAdd = async (text) => {
    try {
      const c = await addComment(text)
      setComments((prev) => [c, ...prev])
      setFormOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to add comment')
    }
  }

  const handleEdit = async (id, text) => {
    try {
      const updated = await editComment(id, text)
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (err) {
      setError(err.message || 'Failed to edit comment')
    }
  }

  const handleDelete = async (id) => {
    try {
      const ok = await deleteComment(id)
      if (ok) setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar__inner">
          <h1 className="navbar__title">Message Board</h1>
          <div className="navbar__actions">
            <button
              className={formOpen ? 'add-btn add-btn--expanded' : 'add-btn'}
              onClick={() => setFormOpen((v) => !v)}
              aria-expanded={formOpen}
              aria-controls="new-comment"
              title={formOpen ? 'Hide new comment' : 'Add a new comment'}
            >
              <span className="add-btn__icon">＋</span>
              <span className="add-btn__label">Add Comment</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay modal when adding a new comment */}
      {formOpen && (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target.classList && e.target.classList.contains('overlay')) {
              setFormOpen(false)
            }
          }}
        >
          <div className="modal">
            <div className="modal__header">
              <h2 id="modal-title" className="modal__title">Add Comment</h2>
              <button className="text-btn modal__close" onClick={() => setFormOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal__body">
              <CommentForm id="new-comment" onAdd={handleAdd} onCancel={() => setFormOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert">{error}</div>}
      {loading ? (
        <p className="muted">Loading comments…</p>
      ) : (
        <CommentList comments={comments} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default App
