import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  doctorName: '',
  specialty: '',
  date: '',
  time: '',
  location: '',
  notes: '',
  status: 'upcoming',
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      setError('Could not load appointments.');
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
        await api.put(`/appointments/${editingId}`, form);
        setSuccess('Appointment updated.');
      } else {
        await api.post('/appointments', form);
        setSuccess('Appointment added.');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEdit = (a) => {
    setForm({
      doctorName: a.doctorName,
      specialty: a.specialty || '',
      date: a.date ? a.date.slice(0, 10) : '',
      time: a.time || '',
      location: a.location || '',
      notes: a.notes || '',
      status: a.status,
    });
    setEditingId(a._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (err) {
      setError('Could not delete appointment.');
    }
  };

  return (
    <div>
      <h1>Appointments</h1>
      <p className="page-subtitle">Keep track of your doctor visits.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Appointment' : 'Add Appointment'}</h2>
        <div className="form-grid">
          <div>
            <label>Doctor Name</label>
            <input name="doctorName" value={form.doctorName} onChange={handleChange} required />
          </div>
          <div>
            <label>Specialty</label>
            <input name="specialty" value={form.specialty} onChange={handleChange} />
          </div>
          <div>
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Time</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} />
          </div>
          <div>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Save Changes' : 'Add Appointment'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Your Appointments</h2>
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">No appointments added yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.doctorName}</td>
                <td>{a.specialty || '-'}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.time || '-'}</td>
                <td>
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                </td>
                <td>
                  <button className="btn btn-small" onClick={() => handleEdit(a)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(a._id)}>
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

export default Appointments;
