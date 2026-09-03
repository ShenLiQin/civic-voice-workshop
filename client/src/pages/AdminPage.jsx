import { useEffect, useState } from "react";
import { getFeedback } from "../api";
import { searchFeedback } from "../feedback-search";

export function AdminPage({ session }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getFeedback(session.token).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [session]);

  const visibleFeedback = searchFeedback(feedback, query);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <section className="feedback-list">
        <div className="list-header"><strong>Latest feedback</strong><span>{visibleFeedback.length} of {feedback.length} items</span></div>
        <label className="feedback-search">
          Search feedback
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages or citizen names"
          />
        </label>
        {visibleFeedback.map((item) => (
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
        {feedback.length > 0 && visibleFeedback.length === 0 && (
          <p className="empty-state">No feedback matches “{query.trim()}”. Try another keyword.</p>
        )}
        {feedback.length === 0 && <p className="empty-state">No feedback has been received yet.</p>}
      </section>
    </main>
  );
}
