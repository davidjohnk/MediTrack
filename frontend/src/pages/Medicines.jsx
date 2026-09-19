import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  name: '',
  dosage: '',
  frequency: '',
  time: '',
  instructions: '',
  startDate: '',
  endDate: '',
  active: true,
};

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadMedicines = async () => {
    try {
      const { data } = await api.get('/medicines');
      setMedicines(data);
    } catch (err) {
      console.error('Could not load medicines.', err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

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
        await api.put(`/medicines/${editingId}`, form);
        setSuccess('Medicine updated.');
      } else {
        await api.post('/medicines', form);
        setSuccess('Medicine added.');
      }
      resetForm();
      loadMedicines();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEdit = (medicine) => {
    setForm({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      time: medicine.time || '',
      instructions: medicine.instructions || '',
      startDate: medicine.startDate ? medicine.startDate.slice(0, 10) : '',
      endDate: medicine.endDate ? medicine.endDate.slice(0, 10) : '',
      active: medicine.active,
    });
    setEditingId(medicine._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      loadMedicines();
    } catch (err) {
      setError('Could not delete medicine.');
    }
  };

  return (
    <div>
      <h1>Medicines</h1>
      <p className="page-subtitle">Keep track of your medicines and dosages.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Medicine' : 'Add Medicine'}</h2>
        <div className="form-grid">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Dosage</label>
            <input
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="e.g. 500mg"
              required
            />
          </div>
          <div>
            <label>Frequency</label>
            <input
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="e.g. Twice a day"
              required
            />
          </div>
          <div>
            <label>Time</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} />
          </div>
          <div>
            <label>Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          </div>
          <div>
            <label>End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          </div>
        </div>
        <label>Instructions</label>
        <textarea name="instructions" value={form.instructions} onChange={handleChange} rows="2" />
        <label className="checkbox-label">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          Active
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Save Changes' : 'Add Medicine'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Your Medicines</h2>
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : medicines.length === 0 ? (
        <div className="empty-state">No medicines added yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>
                <td>{m.time || '-'}</td>
                <td>
                  <span className={`badge ${m.active ? 'badge-active' : 'badge-inactive'}`}>
                    {m.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-small" onClick={() => handleEdit(m)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(m._id)}>
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

export default Medicines;
