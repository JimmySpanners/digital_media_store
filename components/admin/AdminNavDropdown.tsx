import React, { useEffect, useState } from 'react';

interface AdminNavLink {
  id: string;
  title: string;
  section_id: string;
}

interface AdminNavDropdownProps {
  isAdmin: boolean;
}

const AdminNavDropdown: React.FC<AdminNavDropdownProps> = ({ isAdmin }) => {
  const [links, setLinks] = useState<AdminNavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', section_id: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetchLinks();
  }, [isAdmin]);

  // Helper to get access token from localStorage
  function getAccessToken() {
    try {
      const tokenData = localStorage.getItem('supabase.auth.token');
      return tokenData ? JSON.parse(tokenData).currentSession?.access_token : null;
    } catch {
      return null;
    }
  }

  async function fetchLinks() {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch('/api/admin/nav-links', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddOrEdit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/admin/nav-links/${editId}` : '/api/admin/nav-links';
      const token = getAccessToken();
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save link');
      }
      setForm({ title: '', section_id: '' });
      setShowForm(false);
      setEditId(null);
      fetchLinks();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this link?')) return;
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch(`/api/admin/nav-links/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete link');
      }
      fetchLinks();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(link: AdminNavLink) {
    setEditId(link.id);
    setForm({ title: link.title, section_id: link.section_id });
    setShowForm(true);
  }

  if (!isAdmin) return null;

  return (
    <div className="relative inline-block text-left ml-4">
      <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        Links
      </button>
      <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {links.map(link => (
              <li key={link.id} className="flex items-center justify-between px-4 py-2">
                <a href={`#${link.section_id}`} className="text-blue-600 hover:underline" target="_self">
                  {link.title}
                </a>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button className="text-xs text-gray-500 hover:text-blue-600" onClick={() => startEdit(link)}>Edit</button>
                    <button className="text-xs text-red-500 hover:underline" onClick={() => handleDelete(link.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {isAdmin && (
          <div className="p-4 border-t">
            {showForm && (
              <form onSubmit={handleAddOrEdit} className="flex flex-col gap-2">
                <input
                  className="border px-2 py-1 rounded"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
                <input
                  className="border px-2 py-1 rounded"
                  placeholder="Section ID"
                  value={form.section_id}
                  onChange={e => setForm(f => ({ ...f, section_id: e.target.value }))}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
                    {editId ? 'Save' : 'Add'}
                  </button>
                  <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={() => { setShowForm(false); setEditId(null); setForm({ title: '', section_id: '' }); }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {!showForm && (
              <button className="w-full text-left text-sm text-blue-600 hover:underline" onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', section_id: '' }); }}>
                + Add Link
              </button>
            )}
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavDropdown; 