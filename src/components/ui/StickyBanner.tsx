// src/components/ui/StickyBanner.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StickyBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const StickyBanner: React.FC = () => {
  return (
    <Link to="/waiting-list" className={styles.stickyBanner}>
      <FontAwesomeIcon icon={faFire} className={styles.fireEmoji} />
      SOLD OUT for 2025
      <span className={styles.remainingText}>JOIN WAITING LIST FOR 2026</span>
      <FontAwesomeIcon icon={faFire} className={styles.fireEmoji} />
    </Link>
  );
};

export default StickyBanner;