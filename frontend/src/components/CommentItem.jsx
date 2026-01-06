import { useState } from "react";

export default function CommentItem({ comment, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [liked, setLiked] = useState(false);

  const save = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onEdit(comment.id, trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setText(comment.text);
    setEditing(false);
  };

  const formattedDate = new Date(comment.date).toLocaleString();

  return (
    <div className="comment">
      <div className="comment__header">
        <span className="comment__author">{comment.author}</span>
        <span className="comment__date">{formattedDate}</span>
      </div>

      {editing ? (
        <div className="comment__edit">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
        </div>
      ) : (
        <p className="comment__text">{comment.text}</p>
      )}

      {comment.image && (
        <div className="comment__image">
          <img src={comment.image} alt="attachment" />
        </div>
      )}

      <div className="comment__footer">
        <div className="footer__left">
          <button
            className="text-btn"
            aria-label="Like"
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
          >
            <span className={liked ? "heart heart--active" : "heart"}>❤</span>
            <span style={{ marginLeft: 6 }}>{comment.likes}</span>
          </button>
          <button className="text-btn" aria-label="Reply" onClick={() => {}}>
            Reply
          </button>
        </div>
        <div className="footer__right">
          {editing ? (
            <>
              <button className="text-btn" onClick={save}>Save</button>
              <button className="text-btn" onClick={cancel}>Cancel</button>
            </>
          ) : (
            <>
              <button className="text-btn" onClick={() => setEditing(true)}>Edit</button>
              <button className="text-btn" onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
