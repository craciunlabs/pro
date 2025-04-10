// src/components/ui/StickyBanner.tsx
import React from 'react';
import styles from './StickyBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

interface StickyBannerProps {
  spotsRemaining: number;
}

const StickyBanner: React.FC<StickyBannerProps> = ({ spotsRemaining }) => {
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
      SOLD OUT! JOIN THE WAITING LIST FOR NEXT YEAR
      <span className={styles.remainingText}>REGISTRATIONS CLOSED</span>
      <FontAwesomeIcon icon={faFire} className={styles.fireEmoji} />
    </a>
  );
};

export default StickyBanner;