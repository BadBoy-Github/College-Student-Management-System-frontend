import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaChartBar, FaUsers, FaFileAlt, FaPencilAlt, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/users', label: 'Users', icon: <FaUsers />, admin: true },
    { path: '/students', label: 'Students', icon: <FaGraduationCap /> },
    { path: '/documents', label: 'Documents', icon: <FaFileAlt /> },
    { path: '/marks', label: 'Marks', icon: <FaPencilAlt /> },
    { path: '/fees', label: 'Fees', icon: <FaDollarSign /> },
  ];

  const filteredMenu = menuItems.filter(item => !item.admin || user.role === 'ADMIN');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ 
        width: '250px', 
        background: 'var(--bg-card)', 
        borderRight: '1px solid var(--border)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGraduationCap /> College MS
          </h1>
        </div>

        <nav style={{ flex: 1 }}>
          {filteredMenu.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                textDecoration: 'none',
                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-secondary)',
                background: location.pathname === item.path ? 'rgba(249, 115, 22, 0.1)' : 'transparent'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: '500' }}>{user.fullName}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.role}</p>
          </div>
          <button 
            onClick={logout} 
            className="btn-secondary" 
            style={{ width: '100%' }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{ 
        flex: 1, 
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;