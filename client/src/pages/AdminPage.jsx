import { useEffect, useState } from "react";
import { getFeedback, getFeedbackDetail } from "../api";

export function AdminPage({ session }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    getFeedback(session.token).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [session]);

  async function selectFeedback(id) {
    setError("");
    try {
      const response = await getFeedbackDetail(session.token, id);
      setSelectedFeedback(response.feedback);
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
      {selectedFeedback ? (
        <section className="feedback-detail" aria-label="Feedback detail">
          <button className="text-button" type="button" onClick={() => setSelectedFeedback(null)}>← Back to inbox</button>
          <h2>Feedback detail</h2>
          <dl>
            <div><dt>Reference</dt><dd>{selectedFeedback.reference ?? selectedFeedback.id}</dd></div>
            <div><dt>Citizen</dt><dd>{selectedFeedback.name}</dd></div>
            <div><dt>Category</dt><dd>{selectedFeedback.category}</dd></div>
            <div><dt>Status</dt><dd>{selectedFeedback.status}</dd></div>
            <div><dt>Received</dt><dd>{new Date(selectedFeedback.createdAt).toLocaleString()}</dd></div>
            <div><dt>Feedback</dt><dd>{selectedFeedback.message}</dd></div>
          </dl>
        </section>
      ) : <section className="feedback-list">
        <div className="list-header"><strong>Latest feedback</strong><span>{feedback.length} items</span></div>
        {feedback.map((item) => (
          <article className="feedback-row" key={item.id}>
            <div>
              <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
              <p>{item.message}</p>
              <button className="text-button" type="button" onClick={() => selectFeedback(item.id)}>View detail</button>
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
