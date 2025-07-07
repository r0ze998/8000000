// Viewport fix for mobile browsers
if (window.visualViewport) {
  function handleViewportChange() {
    document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport.height}px`);
  }
  
  window.visualViewport.addEventListener('resize', handleViewportChange);
  handleViewportChange();
}