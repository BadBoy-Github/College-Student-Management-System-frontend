import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'TEACHER' });

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/auth/register', formData);
    setShowModal(false);
    setFormData({ fullName: '', email: '', password: '', role: 'TEACHER' });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>User Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Add User</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td><span style={{ color: user.role === 'ADMIN' ? '#f97316' : '#22c55e' }}>{user.role}</span></td>
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add User</h2>
            <form onSubmit={handleSubmit}>
              <label className="label">Full Name</label>
              <input className="input" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              <label className="label">Email</label>
              <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <label className="label">Password</label>
              <input type="password" className="input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <label className="label">Role</label>
              <select className="input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="ADMIN">ADMIN</option>
                <option value="TEACHER">TEACHER</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;