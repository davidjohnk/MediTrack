import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { title: '', type: '', date: '', doctor: '', notes: '' };

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/health-records');
      setRecords(data);
    } catch (err) {
      console.error('Could not load health records.', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/health-records/${editingId}`, form);
        setSuccess('Record updated.');
      } else {
        await api.post('/health-records', form);
        setSuccess('Record added.');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEdit = (r) => {
    setForm({
      title: r.title,
      type: r.type,
      date: r.date ? r.date.slice(0, 10) : '',
      doctor: r.doctor || '',
      notes: r.notes || '',
    });
    setEditingId(r._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/health-records/${id}`);
      load();
    } catch (err) {
      setError('Could not delete record.');
    }
  };

  return (
    <div>
      <h1>Health Records</h1>
      <p className="page-subtitle">Keep a personal log of your health history.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Record' : 'Add Record'}</h2>
        <div className="form-grid">
          <div>
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Type</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="e.g. Lab Result"
              required
            />
          </div>
          <div>
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Doctor</label>
            <input name="doctor" value={form.doctor} onChange={handleChange} />
          </div>
        </div>
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Save Changes' : 'Add Record'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Your Records</h2>
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : records.length === 0 ? (
        <div className="empty-state">No health records added yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.type}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.doctor || '-'}</td>
                <td>
                  <button className="btn btn-small" onClick={() => handleEdit(r)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(r._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HealthRecords;
