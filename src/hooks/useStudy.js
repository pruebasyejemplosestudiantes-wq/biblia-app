import { useState, useEffect } from 'react'

const KEY = 'bible_study'

const def = {
  bookmarks:    [],   // [{ book, chapter, verse, ref, text }]
  highlights:   [],   // [{ book, chapter, verse, ref, text, color }]
  notes:        [],   // [{ id, ref, text, note, date, topicId? }]  ← verse notes from Bible
  journalNotes: [],   // [{ id, title, content, date, topicId? }]   ← free notes from Library
  topics:       [],   // [{ id, name, color }]
  planProgress: {},
  streak: 0,
  lastActiveDate: null,
  readChapters: [],
}

const TOPIC_COLORS = ['#B5566A','#7B5EA7','#C08B45','#4A9B7A','#5B8EC4','#C47C3A']

export function useStudy() {
  const [study, setStudy] = useState(() => {
    try { return { ...def, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
    catch { return def }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(study)) }, [study])

  /* ── Verse actions (Bible reader) ── */
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

  /* ── Journal notes (Library) ── */
  function saveJournalNote(title, content, topicId = '') {
    setStudy(s => ({
      ...s,
      journalNotes: [
        { id: Date.now(), title: title.trim() || 'Untitled', content, topicId, date: new Date().toLocaleDateString() },
        ...(s.journalNotes || []),
      ],
    }))
  }

  function updateJournalNote(id, title, content, topicId) {
    setStudy(s => ({
      ...s,
      journalNotes: (s.journalNotes || []).map(n =>
        n.id === id ? { ...n, title: title.trim() || 'Untitled', content, topicId } : n
      ),
    }))
  }

  function deleteJournalNote(id) {
    setStudy(s => ({ ...s, journalNotes: (s.journalNotes || []).filter(n => n.id !== id) }))
  }

  /* ── Topics ── */
  function saveTopic(name) {
    const usedColors = study.topics.map(t => t.color)
    const color = TOPIC_COLORS.find(c => !usedColors.includes(c)) || TOPIC_COLORS[(study.topics || []).length % TOPIC_COLORS.length]
    setStudy(s => ({
      ...s,
      topics: [...(s.topics || []), { id: Date.now(), name: name.trim(), color }],
    }))
  }

  function deleteTopic(id) {
    setStudy(s => ({
      ...s,
      topics: (s.topics || []).filter(t => t.id !== id),
      journalNotes: (s.journalNotes || []).map(n => n.topicId === id ? { ...n, topicId: '' } : n),
      notes: s.notes.map(n => n.topicId === id ? { ...n, topicId: '' } : n),
    }))
  }

  /* ── Reading progress ── */
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

  return {
    study,
    toggleBookmark, toggleHighlight, saveNote, deleteNote,
    saveJournalNote, updateJournalNote, deleteJournalNote,
    saveTopic, deleteTopic,
    markDayComplete, markChapterRead,
    isBookmarked, isHighlighted, getNote,
  }
}
