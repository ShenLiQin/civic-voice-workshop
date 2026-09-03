export function searchFeedback(feedback, query) {
  const searchTerm = query.trim().toLocaleLowerCase();
  if (!searchTerm) return feedback;

  return feedback.filter((item) => [item.name, item.message].some(
    (value) => value?.toLocaleLowerCase().includes(searchTerm),
  ));
}
