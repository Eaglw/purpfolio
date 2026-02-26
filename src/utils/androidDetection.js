// Detect Android devices and Chrome browser
function detectAndroid() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
    
    return {
      isAndroid,
      isChrome,
      isAndroidChrome: isAndroid && isChrome
    };
  }
  
  // Apply Android-specific fixes
  document.addEventListener('DOMContentLoaded', function() {
    const { isAndroid, isAndroidChrome } = detectAndroid();
    
    if (isAndroid) {
      // Add a class to the body to target Android-specific CSS
      document.body.classList.add('android-device');
      
      // For Chrome on Android specifically
      if (isAndroidChrome) {
        document.body.classList.add('android-chrome');
        
        // Apply specific fixes to animated elements
        const animatedElements = document.querySelectorAll('.animate');
        animatedElements.forEach(element => {
          // Use transform: translate3d to force hardware acceleration
          element.style.transform = 'translate3d(0, 0, 0)';
          // Ensure hardware acceleration
          element.style.willChange = 'transform, opacity';
          // Remove any transitions that might conflict with animations
          element.style.webkitBackfaceVisibility = 'hidden';
          element.style.backfaceVisibility = 'hidden';
          element.style.webkitPerspective = '1000';
          element.style.perspective = '1000';
        });
      }
    }
  });
  
  // Export the detection function for use in other modules
  export default detectAndroid;