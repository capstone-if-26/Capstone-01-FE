import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import styles from './layout.module.css';
import SearchBar from '../../components/layout/search-bar';
import ProtectedRoute from '@/components/layout/protected-route';
import TopActions from '@/components/layout/top-actions';

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

           <TopActions />
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}