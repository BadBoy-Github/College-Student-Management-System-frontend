import { useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '', rollNumber: '', department: '', year: '', email: '', phone: '', address: ''
  });

  const fetchStudents = async () => {
    api.get('/students', { params: { search } })
      .then(res => { setStudents(res.data); setLoading(false); });
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
      } else {
        await api.post('/students', formData);
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ name: '', rollNumber: '', department: '', year: '', email: '', phone: '', address: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await api.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Students</h1>
        {user.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add Student</button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="input"
          placeholder="Search students by name, roll number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Department</th>
              <th>Year</th>
              <th>Email</th>
              {user.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>{student.email}</td>
                {user.role === 'ADMIN' && (
                  <td>
                    <button className="btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(student)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(student._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <label className="label">Name</label>
              <input className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <label className="label">Roll Number</label>
              <input className="input" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} required />
              <label className="label">Department</label>
              <input className="input" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
              <label className="label">Year</label>
              <input type="number" className="input" value={formData.year} onChange={(e) => setFormData({...formData, year: Number(e.target.value)})} required />
              <label className="label">Email</label>
              <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <label className="label">Phone</label>
              <input className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              <label className="label">Address</label>
              <textarea className="input" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => { setShowModal(false); setEditingStudent(null); }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;