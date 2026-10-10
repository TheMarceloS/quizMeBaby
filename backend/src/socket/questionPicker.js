function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Prefer questions not yet used in this session. If the unused pool is empty,
 * recycle the full pool. If unused is non-empty but shorter than needed, take
 * all unused first, then fill from previously used questions.
 */
export function pickQuestionsForRound(allQuestions, numQuestions, usedQuestionIds) {
  if (!allQuestions?.length) return []

  const want = Math.min(Math.max(1, numQuestions), allQuestions.length)
  let unused = allQuestions.filter(q => !usedQuestionIds.has(q.id))

  if (unused.length === 0) {
    usedQuestionIds.clear()
    unused = [...allQuestions]
  }

  const selected = shuffle(unused).slice(0, Math.min(want, unused.length))

  if (selected.length < want) {
    const selectedIds = new Set(selected.map(q => q.id))
    const fillers = shuffle(
      allQuestions.filter(q => usedQuestionIds.has(q.id) && !selectedIds.has(q.id)),
    )
    selected.push(...fillers.slice(0, want - selected.length))
  }

  return selected
}
