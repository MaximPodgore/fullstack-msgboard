const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : "http://localhost:8000/api/comments";

async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function fetchComments() {
  const res = await fetch(`${BASE}/`, { method: "GET" });
  if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
  const data = await parseJson(res);
  return data.comments ?? [];
}

export async function addComment(text) {
  const res = await fetch(`${BASE}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Failed to add comment (${res.status})`);
  const data = await parseJson(res);
  return data.comment;
}

export async function editComment(id, text) {
  const res = await fetch(`${BASE}/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Failed to edit comment (${res.status})`);
  const data = await parseJson(res);
  return data.comment;
}

export async function deleteComment(id) {
  const res = await fetch(`${BASE}/${id}/delete`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete comment (${res.status})`);
  const data = await parseJson(res);
  return data.deleted === true;
}
