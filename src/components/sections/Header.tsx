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
        <a href="/" className={styles.logo} aria-label="Mia Ottosson Home">
          Mia Ottosson
        </a>
        
        {/* Mobile menu button */}
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