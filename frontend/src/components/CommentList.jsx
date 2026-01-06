import CommentItem from "./CommentItem.jsx";

export default function CommentList({ comments, onEdit, onDelete }) {
  if (!comments.length) {
    return <p className="muted">No comments yet.</p>;
  }
  return (
    <div className="comment-list">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
