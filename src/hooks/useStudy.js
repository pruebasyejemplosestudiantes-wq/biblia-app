import { useState, useEffect } from 'react'

const KEY = 'bible_study'

const def = {
  bookmarks: [],      // [{ book, chapter, verse, ref, text }]
  highlights: [],     // [{ book, chapter, verse, ref, text, color }]
  notes: [],          // [{ id, ref, text, note, date }]
  planProgress: {},   // { planId: { completedDays: [] } }
  streak: 0,
  lastActiveDate: null,
  readChapters: [],   // ['genesis-1', 'john-3', ...]
}

export function useStudy() {
  const [study, setStudy] = useState(() => {
    try { return { ...def, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
    catch { return def }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(study)) }, [study])

  function toggleBookmark(item) {
    setStudy(s => {
      const exists = s.bookmarks.find(b => b.ref === item.ref)
      return { ...s, bookmarks: exists ? s.bookmarks.filter(b => b.ref !== item.ref) : [...s.bookmarks, item] }
    })
  }

  function toggleHighlight(item, color = '#FFE066') {
    setStudy(s => {
      const exists = s.highlights.find(h => h.ref === item.ref)
      return { ...s, highlights: exists ? s.highlights.filter(h => h.ref !== item.ref) : [...s.highlights, { ...item, color }] }
    })
  }

  function saveNote(item, noteText) {
    setStudy(s => {
      const exists = s.notes.find(n => n.ref === item.ref)
      if (exists) {
        return { ...s, notes: s.notes.map(n => n.ref === item.ref ? { ...n, note: noteText } : n) }
      }
      return { ...s, notes: [...s.notes, { ...item, note: noteText, id: Date.now(), date: new Date().toLocaleDateString() }] }
    })
  }

  function deleteNote(ref) {
    setStudy(s => ({ ...s, notes: s.notes.filter(n => n.ref !== ref) }))
  }

  function markDayComplete(planId, day) {
    setStudy(s => {
      const prev = s.planProgress[planId] || { completedDays: [] }
      if (prev.completedDays.includes(day)) return s
      const today = new Date().toDateString()
      const streak = s.lastActiveDate === today ? s.streak
        : s.lastActiveDate === new Date(Date.now() - 86400000).toDateString() ? s.streak + 1 : 1
      return {
        ...s,
        planProgress: { ...s.planProgress, [planId]: { completedDays: [...prev.completedDays, day] } },
        streak,
        lastActiveDate: today,
      }
    })
  }

  function markChapterRead(bookId, chapter) {
    const key = `${bookId}-${chapter}`
    setStudy(s => {
      if (s.readChapters.includes(key)) return s
      const today = new Date().toDateString()
      const streak = s.lastActiveDate === today ? s.streak
        : s.lastActiveDate === new Date(Date.now() - 86400000).toDateString() ? s.streak + 1 : 1
      return { ...s, readChapters: [...s.readChapters, key], streak, lastActiveDate: today }
    })
  }

  function isBookmarked(ref) { return study.bookmarks.some(b => b.ref === ref) }
  function isHighlighted(ref) { return study.highlights.find(h => h.ref === ref) }
  function getNote(ref) { return study.notes.find(n => n.ref === ref) }

  return { study, toggleBookmark, toggleHighlight, saveNote, deleteNote, markDayComplete, markChapterRead, isBookmarked, isHighlighted, getNote }
}
