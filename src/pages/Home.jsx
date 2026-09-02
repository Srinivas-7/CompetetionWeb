import React from 'react';
import { Hero } from '../components/home/Hero';
import { OrganizersSection } from '../components/home/OrganizersSection';
import { Footer } from '../components/common/Footer';

export function Home({ 
  totalVotes = 0,
  onExploreClick
}) {
  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Grand Hero & Interactive CTA */}
      <Hero 
        onExploreClick={onExploreClick} 
        totalVotes={totalVotes}
      />

      {/* 2. Honored Event Organizers */}
      <OrganizersSection />

      {/* 3. Bottom Footer */}
      <Footer />
    </div>
  );
}
