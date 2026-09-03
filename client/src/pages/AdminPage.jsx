import { useEffect, useState } from "react";
import { getFeedback } from "../api";

export function AdminPage({ session }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { category: params.get("category") ?? "", status: params.get("status") ?? "" };
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
    setError("");
    getFeedback(session.token, filters).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [session, filters]);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="inbox-filters" aria-label="Feedback filters">
        <label htmlFor="category-filter">Category
          <select id="category-filter" name="category" value={filters.category} onChange={updateFilter}>
            <option value="">All categories</option>
            <option value="Estate">Estate</option>
            <option value="Transport">Transport</option>
            <option value="Environment">Environment</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label htmlFor="status-filter">Status
          <select id="status-filter" name="status" value={filters.status} onChange={updateFilter}>
            <option value="">All statuses</option>
            <option value="New">New</option>
            <option value="In review">In review</option>
            <option value="Closed">Closed</option>
          </select>
        </label>
        <button type="button" onClick={() => setFilters({ category: "", status: "" })}>Clear filters</button>
      </div>
      <section className="feedback-list">
        <div className="list-header"><strong>Latest feedback</strong><span>{feedback.length} items</span></div>
        {feedback.map((item) => (
          <article className="feedback-row" key={item.id}>
            <div>
              <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
              <p>{item.message}</p>
            </div>
            <div className="feedback-tags">
              <span className="category-pill">{item.category}</span>
              <span className="status-pill">{item.status}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
