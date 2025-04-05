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
  // Handle smooth scroll with closing menu
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close the menu
    onClose();
    
    // Extract the ID from href (e.g., "/#about" -> "about")
    const targetId = href.split('#')[1];
    
    if (targetId) {
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Small delay to allow menu to close first
    }
  };

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
                onClick={(e) => handleSmoothScroll(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        
        <a 
          href="#pricing" 
          className={`btn btn-primary ${styles.mobileNavCta}`}
          onClick={(e) => handleSmoothScroll(e, "#pricing")}
        >
          Secure Your Place
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;