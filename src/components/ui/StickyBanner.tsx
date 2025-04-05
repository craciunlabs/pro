// src/components/ui/StickyBanner.tsx
import React from 'react';
import styles from './StickyBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

interface StickyBannerProps {
  message?: string;
  spotsRemaining?: number;
}

const StickyBanner: React.FC<StickyBannerProps> = ({ 
  message = "ENROLLMENT CLOSING SOON", 
  spotsRemaining = 3 
}) => {
  return (
    <div className={styles.stickyBanner}>
      <span className={styles.fireEmoji}><FontAwesomeIcon icon={faFire} /></span>
      <span>{message}: ONLY {spotsRemaining} SPOTS REMAINING</span>
      <span className={styles.fireEmoji}><FontAwesomeIcon icon={faFire} /></span>
    </div>
  );
};

export default StickyBanner;