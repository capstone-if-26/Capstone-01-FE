"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/(main)/layout.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/library?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.searchBar}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        id="global-search"
        name="global-search"
        aria-label="Search projects"
        type="text" 
        placeholder="Search projects..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
