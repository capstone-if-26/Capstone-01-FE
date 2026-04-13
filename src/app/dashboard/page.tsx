import styles from './page.module.css';

const recentContents = [
  { id: 1, title: 'Exploring Mars: AI...', status: 'Published', time: '2 hours ago', duration: '0:45' },
  { id: 2, title: 'Tech Trends 2024...', status: 'Processing', time: 'Just now', duration: '-' },
  { id: 3, title: 'Product Showcase...', status: 'Published', time: 'Yesterday', duration: '1:20' },
  { id: 4, title: 'Nature B-Roll Pack 04', status: 'Published', time: '3 days ago', duration: '0:15' },
];

export default function DashboardPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div>
          <h1>Halo, Alex! 👋</h1>
          <p>Siap untuk membuat konten AI yang luar biasa hari ini?</p>
        </div>
        <button className={styles.primaryButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Buat Video Baru
        </button>
      </section>

      {/* Stats Cards */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIconBlue}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
          </div>
          <div>
            <p className={styles.statLabel}>TOTAL VIDEO</p>
            <h2 className={styles.statValue}>124</h2>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconYellow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <p className={styles.statLabel}>CREDITS LEFT</p>
            <h2 className={styles.statValue}>450</h2>
          </div>
        </div>
      </section>

      {/* Recent Content */}
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h3>Recent Content</h3>
          <a href="/dashboard/projects" className={styles.viewAll}>View All</a>
        </div>
        
        <div className={styles.gridContainer}>
          {recentContents.map((item) => (
            <div key={item.id} className={styles.contentCard}>
              <div className={styles.thumbnailPlaceholder}>
                <span className={styles.duration}>{item.duration}</span>
              </div>
              <h4>{item.title}</h4>
              <div className={styles.cardFooter}>
                <span className={item.status === 'Published' ? styles.badgeGreen : styles.badgeYellow}>
                  <span className={styles.dot}></span> {item.status}
                </span>
                <span className={styles.time}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Widgets */}
      <section className={styles.bottomWidgets}>
        {/* Widget Kiri: Tips */}
        <div className={styles.tipsCard}>
          <h3>Tips Hari Ini 💡</h3>
          <p>Gunakan prompt yang spesifik untuk mendapatkan detail video yang lebih tajam. Coba tambahkan kata kunci seperti 'cinematic lighting' atau '4k resolution'.</p>
          <button className={styles.outlineButton}>Lihat Panduan Prompt</button>
        </div>

        {/* Widget Kanan: Templates */}
        <div className={styles.templateWidget}>
          <h3>Template Terpopuler</h3>
          <div className={styles.templateGrid}>
            <div className={styles.templateItem}>
              <h4>E-Commerce</h4>
              <p>Iklan produk 15 detik</p>
            </div>
            <div className={styles.templateItem}>
              <h4>Educational</h4>
              <p>Video tutorial AI</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}