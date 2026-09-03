import { useEffect, useRef, useState } from "react";
import { submitFeedback } from "../api";
import { hasFeedbackContent } from "../feedback";

export function CitizenPage({ user }) {
  const maximumMessageLength = 500;
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState("");
  const [messageError, setMessageError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const messageInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const announcementRef = useRef(null);

  useEffect(() => {
    if (messageError) {
      messageInputRef.current?.focus();
    } else if (categoryError) {
      categoryInputRef.current?.focus();
    } else if (submissionError) {
      announcementRef.current?.focus();
    } else if (submitted) {
      announcementRef.current?.focus();
    }
  }, [categoryError, messageError, submissionError, submitted]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessageError("");
    setCategoryError("");
    setSubmissionError("");
    if (!hasFeedbackContent(message)) {
      setMessageError("Please enter feedback that is not blank.");
      return;
    }
    if (!category) {
      setCategoryError("Please choose a category.");
      return;
    }
    try {
      const response = await submitFeedback({ nric: user.nric, name: user.name, message, category });
      setSubmissionReference(response.feedback.reference);
      setSubmitted(true);
      setMessage("");
      setCategory("");
    } catch (requestError) {
      setSubmissionError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div className="eyebrow">Public feedback</div>
        <h1>What would you like us to know?</h1>
        <p>Tell us about an issue, an idea, or a positive experience in your community.</p>
      </div>
      <section className="form-card" aria-labelledby="feedback-form-heading">
        <h2 id="feedback-form-heading" className="visually-hidden">Feedback form</h2>
        {submitted && (
          <div className="success-banner" role="status" aria-live="polite" tabIndex="-1" ref={announcementRef}>
            Thank you. Your feedback has been received. Your reference is <strong>{submissionReference}</strong>.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="feedback-message">Your feedback
            <textarea
              id="feedback-message"
              ref={messageInputRef}
              rows="7"
              value={message}
              maxLength={maximumMessageLength}
              aria-invalid={Boolean(messageError)}
              aria-describedby={messageError ? "feedback-character-count feedback-message-error" : "feedback-character-count"}
              onChange={(event) => {
                setMessage(event.target.value);
                if (messageError) setMessageError("");
              }}
              placeholder="Share your feedback here..."
            />
          </label>
          <p id="feedback-character-count" className="muted" aria-live="polite">{message.length} / {maximumMessageLength} characters</p>
          {messageError && <p id="feedback-message-error" className="error-message" role="alert">{messageError}</p>}
          <label htmlFor="feedback-category">Category
            <select
              id="feedback-category"
              ref={categoryInputRef}
              value={category}
              aria-invalid={Boolean(categoryError)}
              aria-describedby={categoryError ? "feedback-category-error" : undefined}
              onChange={(event) => {
                setCategory(event.target.value);
                if (categoryError) setCategoryError("");
              }}
            >
              <option value="" disabled>Choose a category</option>
              <option value="Estate">Estate</option>
              <option value="Transport">Transport</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {categoryError && <p id="feedback-category-error" className="error-message" role="alert">{categoryError}</p>}
          <div className="form-footer">
            <span className="muted">Please do not include sensitive personal information.</span>
            <button className="primary-button">Submit feedback</button>
          </div>
          {submissionError && <p className="error-message" role="alert" tabIndex="-1" ref={announcementRef}>{submissionError}</p>}
        </form>
      </section>
    </main>
  );
}
