import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import styles from './layout.module.css';
import SearchBar from '../../components/layout/search-bar';
import ProtectedRoute from '@/components/layout/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        <Sidebar />
      
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
           <div className={styles.headerLeft}>
             <h3>Workspace</h3>
           </div>
           
           <SearchBar />

           <div className={styles.profileActions}>
              <button className={styles.iconButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
              <button className={styles.iconButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </button>
           </div>
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}