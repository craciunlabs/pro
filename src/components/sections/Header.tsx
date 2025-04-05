// src/components/sections/Header.tsx
import React from 'react';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Mobile menu button - hidden on desktop */}
        <button 
          className={styles.mobileMenuBtn} 
          aria-label="Open menu" 
          aria-controls="mobile-menu"
          onClick={onMenuToggle}
        >
          <FontAwesomeIcon icon={faBars} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;