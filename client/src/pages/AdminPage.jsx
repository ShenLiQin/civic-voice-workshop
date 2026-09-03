import { useEffect, useState } from "react";
import { getFeedback, updateFeedbackStatus } from "../api";

export function AdminPage({ session }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedback(session.token).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [session]);

  async function changeStatus(id, status) {
    setError("");
    try {
      const response = await updateFeedbackStatus(session.token, id, status);
      setFeedback((items) => items.map((item) => item.id === id ? response.feedback : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
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
              <label className="status-control" htmlFor={`status-${item.id}`}>
                <span className="sr-only">Status for feedback from {item.name}</span>
                <select id={`status-${item.id}`} value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}>
                  <option value="New">New</option>
                  <option value="In review">In review</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
