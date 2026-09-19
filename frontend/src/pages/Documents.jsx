import { useEffect, useState } from 'react';
import api from '../api/axios';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (err) {
      setError('Could not load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError('');
    setSuccess('');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Document uploaded.');
      setFile(null);
      e.target.reset();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      load();
    } catch (err) {
      setError('Could not delete document.');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const filesBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(
    '/api',
    ''
  );

  return (
    <div>
      <h1>Documents</h1>
      <p className="page-subtitle">
        Store copies of medical documents for your own reference. This is a demo local file
        store for learning purposes — do not upload real sensitive medical records here.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-card" onSubmit={handleUpload}>
        <h2>Upload Document</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      <h2>Your Documents</h2>
      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="empty-state">No documents uploaded yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.type || '-'}</td>
                <td>{formatSize(d.size)}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>
                  <a
                    className="btn btn-small"
                    href={`${filesBaseUrl}/uploads/${d.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(d._id)}>
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

export default Documents;
