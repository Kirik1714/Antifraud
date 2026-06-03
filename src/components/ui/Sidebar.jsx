import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ArrowLeftRight, 
  HelpCircle, 
  Settings, 
  ChevronDown,
  ChevronLeft, 
  ChevronRight,
  Users
} from 'lucide-react';
import styles from './Sidebar.module.scss';

export default function Sidebar({ isReviewPage = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎯 ИСПРАВЛЕНО: Если это страница ревью транзакций, сайдбар ИЗНАЧАЛЬНО свернут (true)
  const [isCollapsed, setIsCollapsed] = useState(isReviewPage);

  // Следим за переключением страниц
  useEffect(() => {
    if (isReviewPage) {
      setIsCollapsed(true);
    }
  }, [isReviewPage]);

  const isActive = (path) => location.pathname === path;
  
  const toggleSidebar = () => {
    if (isReviewPage) return; // Полная блокировка клика
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`} style={{ padding: isReviewPage ? '0px 0px 24px 0px' : '24px 0' }}>
      
      {/* ШАПКА САЙДБАРА */}
     {!isReviewPage && (
      <div className={`${styles.sidebarHeader} ${isCollapsed ? styles.headerCollapsed : ''}`}>
        {!isCollapsed && <p className={styles.groupTitle}>Fraud Management</p>}
        
        <button onClick={toggleSidebar} className={styles.toggleBtn}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    )}

  <div className={styles.menuGroup} style={{ paddingTop: isReviewPage ? '16px' : '0' }}>
      {/* Dashboard */}
      <div 
        className={`${styles.menuItem} ${isActive('/dashboard') ? styles.active : ''}`}
        onClick={() => navigate('/dashboard')}
        title="Dashboard"
      >
        <LayoutDashboard size={18} />
        {!isCollapsed && <span>Dashboard</span>}
        <span className={styles.mobileText}>Dashboard</span>
      </div>

        {/* Clients */}
        <div 
          className={`${styles.menuItem} ${isActive('/clients') ? styles.active : ''}`}
          onClick={() => navigate('/clients')}
          title="Clients Database"
        >
          <Users size={18} />
          {!isCollapsed && <span>Clients</span>}
          <span className={styles.mobileText}>Clients</span>
        </div>
        
        {/* Reports */}
        <div className={styles.menuItem} title="Reports">
          <FileText size={18} />
          {!isCollapsed && <span>Reports</span>}
          {!isCollapsed && <ChevronDown size={14} className={styles.arrow} />}
          <span className={styles.mobileText}>Reports</span>

        </div>
        
        {/* Transactions */}
        <div 
          className={`${styles.menuItem} ${isActive('/transactions') ? styles.active : ''}`}
          onClick={() => navigate('/transactions')}
          title="Transactions Review"
        >
          <ArrowLeftRight size={18} />
          {!isCollapsed && <span>Transactions</span>}
          {!isCollapsed && <ChevronDown size={14} className={styles.arrow} />}
          <span className={styles.mobileText}>Transactions</span>

          
        </div>
        
        <div className={styles.menuItem} title="Help">
          <HelpCircle size={18} />
          {!isCollapsed && <span>Help</span>}
          <span className={styles.mobileText}>Help</span>

        </div>
        
        <div className={styles.menuItem} title="Settings">
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
          <span className={styles.mobileText}>Settings</span>

        </div>
      </div>
    </aside>
  );
}