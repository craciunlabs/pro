// src/components/sections/MobileMenu.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navLinks }) => {
  return (
    <div 
      className={`${styles.mobileMenu} ${isOpen ? styles.active : ''}`}
      id="mobile-menu"
      aria-hidden={!isOpen}
    >
      <div className={styles.menuContentWrapper}>
        <div className={styles.mobileMenuHeader}>
          <a href="/" className={styles.logo}>Mia Ottosson</a>
          <button
            className={styles.mobileMenuClose}
            onClick={onClose}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          </button>
        </div>
        
        <ul className={styles.mobileMenuLinks}>
          {navLinks.map((link, index) => (
            <li key={index}>
              <a 
                href={link.href} 
                onClick={onClose}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        
        <a 
          href="#pricing" 
          className={`btn btn-primary ${styles.mobileNavCta}`}
          onClick={onClose}
        >
          Secure Your Place
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;