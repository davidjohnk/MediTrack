import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      <p className="page-subtitle">Your basic account information.</p>
      <div className="form-card">
        <label>Name</label>
        <input value={user?.name || ''} disabled />
        <label>Email</label>
        <input value={user?.email || ''} disabled />
        <p className="hint-text">
          Profile editing isn't part of this beginner build, but this is exactly where you'd
          add a "Save changes" form connected to a new PUT /api/auth/me endpoint.
        </p>
      </div>
    </div>
  );
};

export default Profile;
