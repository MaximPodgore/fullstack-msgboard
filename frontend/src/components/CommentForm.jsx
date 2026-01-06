import { useEffect, useRef, useState } from "react";

export default function CommentForm({ id, onAdd, onCancel }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setText("");
  };

  return (
    <form id={id} className="comment comment-form" onSubmit={submit}>
      <textarea
        ref={ref}
        placeholder="Write a new comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <div className="comment-form__actions">
        {onCancel && (
          <button className="text-btn" type="button" onClick={onCancel}>Cancel</button>
        )}
        <button className="text-btn" type="submit">Add Comment</button>
      </div>
    </form>
  );
}
