import { useState, useEffect } from 'react';
import axios from 'axios';

const Documents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedDoc, setGeneratedDoc] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students').then(res => {
      setStudents(res.data);
      setLoading(false);
    });
  }, []);

  const generateDocument = async (type) => {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) return alert('Please select a student');
    
    const res = await axios.post(`http://localhost:5000/api/documents/${type}`, { studentId });
    setGeneratedDoc(res.data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Document Generation</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <label className="label">Select Student</label>
        <select id="studentSelect" className="input">
          <option value="">Select Student</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.name} - {s.rollNumber}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => generateDocument('bonafide')}>Generate Bonafide</button>
          <button className="btn-primary" onClick={() => generateDocument('transfer-certificate')}>Generate Transfer Certificate</button>
          <button className="btn-primary" onClick={() => generateDocument('marksheet')}>Generate Marksheet</button>
        </div>
      </div>

      {generatedDoc && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{generatedDoc.documentType.replace('_', ' ')}</h3>
          <pre style={{ 
            background: 'var(--bg-input)', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            lineHeight: '1.6'
          }}>
            {generatedDoc.content}
          </pre>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '1rem' }}
            onClick={() => {
              const printWindow = window.open('', '_blank');
              printWindow.document.write(`<pre>${generatedDoc.content}</pre>`);
              printWindow.document.close();
              printWindow.print();
            }}
          >
            Print Document
          </button>
        </div>
      )}
    </div>
  );
};

export default Documents;