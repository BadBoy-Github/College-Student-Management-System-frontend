import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statsCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: '🎓', color: 'var(--primary)' },
    { label: 'Fees Collected', value: `₹${stats?.totalFeesCollected?.toLocaleString() || 0}`, icon: '💰', color: '#22c55e' },
    { label: 'Fees Pending', value: `₹${stats?.totalFeesPending?.toLocaleString() || 0}`, icon: '⏳', color: '#ef4444' },
    { label: 'Documents Generated', value: stats?.pendingDocuments || 0, icon: '📄', color: '#8b5cf6' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem', fontWeight: 'bold' }}>Dashboard</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statsCards.map((stat, index) => (
          <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '12px', 
              background: `${stat.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Average Marks by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.averageMarksByDept || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="department" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="average" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Recent Activities</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {stats?.recentActivities?.slice(0, 8).map((activity, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem 0', 
                borderBottom: '1px solid var(--border)' 
              }}>
                <div>
                  <p style={{ fontWeight: '500' }}>{activity.item}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {activity.type} - {activity.action}
                  </p>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;