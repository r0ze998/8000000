// Accessibility utilities for screen readers and keyboard navigation

// Screen reader announcements
export const screenReader = {
  // Announce message to screen readers
  announce: (message, priority = 'polite') => {
    if (typeof window === 'undefined') return;

    // Create or get the aria-live region
    let liveRegion = document.getElementById(`sr-announce-${priority}`);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = `sr-announce-${priority}`;
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Clear previous announcement
    liveRegion.textContent = '';

    // Set new announcement after a brief delay
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  },

  // Announce page changes
  announcePageChange: (pageName) => {
    screenReader.announce(`${pageName}に移動しました`, 'polite');
  },

  // Announce loading states
  announceLoading: (isLoading, itemName = 'コンテンツ') => {
    if (isLoading) {
      screenReader.announce(`${itemName}を読み込んでいます`, 'polite');
    } else {
      screenReader.announce(`${itemName}の読み込みが完了しました`, 'polite');
    }
  },

  // Announce errors
  announceError: (errorMessage) => {
    screenReader.announce(`エラー: ${errorMessage}`, 'assertive');
  },

  // Announce success
  announceSuccess: (successMessage) => {
    screenReader.announce(successMessage, 'polite');
  }
};

// Focus management utilities
export const focusManager = {
  // Trap focus within an element
  trapFocus: (element) => {
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstFocusableElement?.focus();

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Restore focus to previous element
  restoreFocus: (previousElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  },

  // Move focus to element
  moveFocusTo: (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }
};

// Keyboard navigation helpers
export const keyboardNav = {
  // Handle arrow key navigation
  handleArrowKeys: (e, currentIndex, items, onChange) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      onChange(newIndex);
      items[newIndex]?.focus();
    }
  },

  // Check if user is using keyboard
  isUsingKeyboard: () => {
    let usingKeyboard = false;

    // Mouse user
    document.addEventListener('mousedown', () => {
      usingKeyboard = false;
    });

    // Keyboard user
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        usingKeyboard = true;
      }
    });

    return () => usingKeyboard;
  }
};

// ARIA helpers
export const aria = {
  // Set loading state
  setLoadingState: (element, isLoading) => {
    if (!element) return;
    
    element.setAttribute('aria-busy', isLoading);
    element.setAttribute('aria-live', isLoading ? 'polite' : 'off');
  },

  // Set expanded state
  setExpandedState: (element, isExpanded) => {
    if (!element) return;
    
    element.setAttribute('aria-expanded', isExpanded);
  },

  // Set selected state
  setSelectedState: (element, isSelected) => {
    if (!element) return;
    
    element.setAttribute('aria-selected', isSelected);
    if (isSelected) {
      element.setAttribute('aria-current', 'true');
    } else {
      element.removeAttribute('aria-current');
    }
  },

  // Set invalid state
  setInvalidState: (element, isInvalid, errorMessage) => {
    if (!element) return;
    
    element.setAttribute('aria-invalid', isInvalid);
    
    if (isInvalid && errorMessage) {
      const errorId = `${element.id}-error`;
      element.setAttribute('aria-describedby', errorId);
      
      // Create or update error message element
      let errorElement = document.getElementById(errorId);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        element.parentNode.insertBefore(errorElement, element.nextSibling);
      }
      errorElement.textContent = errorMessage;
    }
  }
};

// Color contrast checker
export const contrastChecker = {
  // Get relative luminance
  getRelativeLuminance: (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1, color2) => {
    const lum1 = contrastChecker.getRelativeLuminance(color1);
    const lum2 = contrastChecker.getRelativeLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (contrastRatio, level = 'AA', isLargeText = false) => {
    if (level === 'AA') {
      return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
    } else if (level === 'AAA') {
      return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7;
    }
    return false;
  }
};

// Reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-contrast: high)');
  return mediaQuery.matches;
};

// Text spacing utilities
export const textSpacing = {
  // Apply WCAG text spacing
  applyWCAGSpacing: (element) => {
    if (!element) return;
    
    element.style.lineHeight = '1.5';
    element.style.letterSpacing = '0.12em';
    element.style.wordSpacing = '0.16em';
    
    // Paragraph spacing
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.marginBottom = '2em';
    });
  },

  // Reset text spacing
  resetSpacing: (element) => {
    if (!element) return;
    
    element.style.lineHeight = '';
    element.style.letterSpacing = '';
    element.style.wordSpacing = '';
    
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.marginBottom = '';
    });
  }
};

// Skip link management
export const skipLinks = {
  // Create skip links
  create: () => {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    
    const links = [
      { href: '#main', text: 'メインコンテンツへスキップ' },
      { href: '#navigation', text: 'ナビゲーションへスキップ' },
      { href: '#search', text: '検索へスキップ' }
    ];

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'skip-link';
      a.textContent = link.text;
      skipLinksContainer.appendChild(a);
    });

    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  }
};

// Export all utilities
export default {
  screenReader,
  focusManager,
  keyboardNav,
  aria,
  contrastChecker,
  prefersReducedMotion,
  prefersHighContrast,
  textSpacing,
  skipLinks
};