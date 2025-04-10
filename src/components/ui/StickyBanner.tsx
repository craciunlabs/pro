// src/components/ui/StickyBanner.tsx
import React from 'react';
import styles from './StickyBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const StickyBanner: React.FC = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a href="#pricing" className={styles.stickyBanner} onClick={handleClick}>
      <FontAwesomeIcon icon={faFire} className={styles.fireEmoji} />
      SOLD OUT for 2025
      <span className={styles.remainingText}>JOIN WAITING LIST FOR 2026</span>
      <FontAwesomeIcon icon={faFire} className={styles.fireEmoji} />
    </a>
  );
};

export default StickyBanner;