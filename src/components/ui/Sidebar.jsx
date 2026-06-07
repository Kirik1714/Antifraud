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
  
  const [isCollapsed, setIsCollapsed] = useState(isReviewPage);

  useEffect(() => {
    if (isReviewPage) {
      setIsCollapsed(true);
    }
  }, [isReviewPage]);

  const isActive = (path) => location.pathname === path;
  
  const toggleSidebar = () => {
    if (isReviewPage) return; 
    setIsCollapsed(!isCollapsed);
  };

  return (
<aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>      
      {!isReviewPage && (
        <div className={`${styles.sidebarHeader} ${isCollapsed ? styles.headerCollapsed : ''}`}>
          {!isCollapsed && <p className={styles.groupTitle}>Fraud Management</p>}
          <button onClick={toggleSidebar} className={styles.toggleBtn} aria-label="Toggle Sidebar">
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      )}

<div className={styles.menuGroup}>        
        {/* Dashboard */}
        <div 
          className={`${styles.menuItem} ${isActive('/dashboard') ? styles.active : ''}`}
          onClick={() => navigate('/dashboard')}
          title="Dashboard"
        >
          <LayoutDashboard size={18} />
          <span className={styles.menuText}>Dashboard</span>
        </div>

        {/* Clients */}
        <div 
          className={`${styles.menuItem} ${isActive('/clients') ? styles.active : ''}`}
          onClick={() => navigate('/clients')}
          title="Clients Database"
        >
          <Users size={18} />
          <span className={styles.menuText}>Clients</span>
        </div>
        
        {/* Reports */}
        <div className={styles.menuItem} title="Reports">
          <FileText size={18} />
          <span className={styles.menuText}>Reports</span>
          <ChevronDown size={14} className={styles.arrow} />
        </div>
        
        {/* Transactions */}
        <div 
          className={`${styles.menuItem} ${isActive('/transactions') ? styles.active : ''}`}
          onClick={() => navigate('/transactions')}
          title="Transactions Review"
        >
          <ArrowLeftRight size={18} />
          <span className={styles.menuText}>Transactions</span>
          <ChevronDown size={14} className={styles.arrow} />
        </div>
        
        {/* Help */}
        <div className={styles.menuItem} title="Help">
          <HelpCircle size={18} />
          <span className={styles.menuText}>Help</span>
        </div>
        
        {/* Settings */}
        <div className={styles.menuItem} title="Settings">
          <Settings size={18} />
          <span className={styles.menuText}>Settings</span>
        </div>

      </div>
    </aside>
  );
}