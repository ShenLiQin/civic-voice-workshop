import { useEffect, useState } from "react";
import { getFeedback } from "../api";

export function AdminPage({ session }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadFeedback() {
    setLoading(true);
    setError("");

    try {
      const response = await getFeedback(session.token);
      setFeedback(response.feedback);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, [session]);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {loading && (
        <section className="inbox-state loading-state" aria-live="polite">
          <span className="loading-indicator" aria-hidden="true" />
          <h2>Loading feedback</h2>
          <p>Retrieving the latest messages from the inbox.</p>
        </section>
      )}
      {!loading && error && (
        <section className="inbox-state error-state" role="alert">
          <h2>We couldn’t load the inbox</h2>
          <p>{error}</p>
          <button className="primary-button" type="button" onClick={loadFeedback}>Try again</button>
        </section>
      )}
      {!loading && !error && feedback.length === 0 && (
        <section className="inbox-state empty-state">
          <h2>No feedback yet</h2>
          <p>New messages from members of the public will appear here.</p>
        </section>
      )}
      {!loading && !error && feedback.length > 0 && <section className="feedback-list">
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
      </section>}
    </main>
  );
}
