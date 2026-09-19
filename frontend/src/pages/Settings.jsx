import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Settings</h1>
      <p className="page-subtitle">Basic account preferences.</p>
      <div className="form-card">
        <h2>Account</h2>
        <p>Manage your session below.</p>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
