import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    studentId: '', totalAmount: '', paidAmount: '0'
  });

  const [paymentData, setPaymentData] = useState({ amount: '' });

  const fetchData = async () => {
    const [feesRes, studentsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/fees'),
      axios.get('http://localhost:5000/api/students')
    ]);
    setFees(feesRes.data);
    setStudents(studentsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      totalAmount: Number(formData.totalAmount),
      paidAmount: Number(formData.paidAmount)
    };
    await axios.post('http://localhost:5000/api/fees', data);
    setShowModal(false);
    setFormData({ studentId: '', totalAmount: '', paidAmount: '0' });
    fetchData();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/fees/${selectedFee._id}`, {
      paidAmount: selectedFee.paidAmount + Number(paymentData.amount),
      paymentDates: [{ amount: Number(paymentData.amount), date: new Date() }]
    });
    setShowPaymentModal(false);
    setSelectedFee(null);
    setPaymentData({ amount: '' });
    fetchData();
  };

  if (loading) return <div>Loading fees...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Fee Management</h1>
        {user.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add Fee Record</button>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(f => (
              <tr key={f._id}>
                <td>{f.studentId?.name || 'Unknown'}</td>
                <td>₹{f.totalAmount}</td>
                <td>₹{f.paidAmount}</td>
                <td>₹{f.dueAmount}</td>
                <td><span className={`status-${f.paymentStatus.toLowerCase()}`}>{f.paymentStatus}</span></td>
                <td>
                  <button className="btn-secondary" onClick={() => { setSelectedFee(f); setShowPaymentModal(true); }}>Add Payment</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Fee Record</h2>
            <form onSubmit={handleSubmit}>
              <label className="label">Student</label>
              <select className="input" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} - {s.rollNumber}</option>)}
              </select>
              <label className="label">Total Amount</label>
              <input type="number" className="input" value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: Number(e.target.value)})} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Payment</h2>
            <p style={{ marginBottom: '1rem' }}>Student: {selectedFee?.studentId?.name}</p>
            <p style={{ marginBottom: '1rem' }}>Due Amount: ₹{selectedFee?.dueAmount}</p>
            <form onSubmit={handlePayment}>
              <label className="label">Amount</label>
              <input type="number" className="input" value={paymentData.amount} onChange={(e) => setPaymentData({ amount: e.target.value })} required min="1" max={selectedFee?.dueAmount} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;