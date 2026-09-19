import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ medicines: 0, appointments: 0, records: 0 });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [medRes, apptRes, recRes] = await Promise.all([
          api.get('/medicines'),
          api.get('/appointments'),
          api.get('/health-records'),
        ]);

        const activeMedicines = medRes.data.filter((m) => m.active).length;
        const upcomingAppointments = apptRes.data.filter((a) => a.status === 'upcoming').length;

        setStats({
          medicines: activeMedicines,
          appointments: upcomingAppointments,
          records: recRes.data.length,
        });
        setRecentRecords(recRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setStats({ medicines: 0, appointments: 0, records: 0 });
        setRecentRecords([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Welcome back, {user?.name}</h1>
      <p className="page-subtitle">Here's an overview of your health information.</p>

      <div className="card-grid">
        <div className="card">
          <div className="card-label">Active Medicines</div>
          <div className="card-value">{stats.medicines}</div>
        </div>
        <div className="card">
          <div className="card-label">Upcoming Appointments</div>
          <div className="card-value">{stats.appointments}</div>
        </div>
        <div className="card">
          <div className="card-label">Health Records</div>
          <div className="card-value">{stats.records}</div>
        </div>
      </div>

      <div className="quick-actions">
        <Link className="btn btn-primary" to="/medicines">
          + Add Medicine
        </Link>
        <Link className="btn btn-primary" to="/appointments">
          + Add Appointment
        </Link>
        <Link className="btn btn-primary" to="/records">
          + Add Record
        </Link>
      </div>

      <h2>Recent Health Records</h2>
      {recentRecords.length === 0 ? (
        <div className="empty-state">
          No health records yet. Add your first one from the Health Records page.
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {recentRecords.map((r) => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.type}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.doctor || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
