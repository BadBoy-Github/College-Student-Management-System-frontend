import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    studentId: '', subject: '', marksObtained: '', maxMarks: '100', semester: '1'
  });

  const fetchData = async () => {
    const [marksRes, studentsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/marks'),
      axios.get('http://localhost:5000/api/students')
    ]);
    setMarks(marksRes.data);
    setStudents(studentsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/marks', formData);
    setShowModal(false);
    setFormData({ studentId: '', subject: '', marksObtained: '', maxMarks: '100', semester: '1' });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this marks entry?')) {
      await axios.delete(`http://localhost:5000/api/marks/${id}`);
      fetchData();
    }
  };

  if (loading) return <div>Loading marks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Marks Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Add Marks</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Semester</th>
              {user.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {marks.map(m => (
              <tr key={m._id}>
                <td>{m.studentId?.name || 'Unknown'}</td>
                <td>{m.subject}</td>
                <td>{m.marksObtained} / {m.maxMarks}</td>
                <td>{m.semester}</td>
                {user.role === 'ADMIN' && (
                  <td><button className="btn-danger" onClick={() => handleDelete(m._id)}>Delete</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Marks</h2>
            <form onSubmit={handleSubmit}>
              <label className="label">Student</label>
              <select className="input" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} - {s.rollNumber}</option>)}
              </select>
              <label className="label">Subject</label>
              <input className="input" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
              <label className="label">Marks Obtained</label>
              <input type="number" className="input" value={formData.marksObtained} onChange={(e) => setFormData({...formData, marksObtained: Number(e.target.value)})} required />
              <label className="label">Max Marks</label>
              <input type="number" className="input" value={formData.maxMarks} onChange={(e) => setFormData({...formData, maxMarks: Number(e.target.value)})} required />
              <label className="label">Semester</label>
              <input type="number" className="input" value={formData.semester} onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})} required />
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

export default Marks;