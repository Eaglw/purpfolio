document.addEventListener('DOMContentLoaded', function() {
  import detectAndroid from '../utils/androidDetection';
  // Detect Android
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isChrome = /chrome/i.test(userAgent);
  
  // Get all animated elements
  const animatedElements = document.querySelectorAll('.animate');
  
  // Apply different fixes based on platform
  animatedElements.forEach(element => {
    // Common fixes for all platforms
    element.style.webkitBackfaceVisibility = 'hidden';
    element.style.backfaceVisibility = 'hidden';
    element.style.webkitPerspective = '1000';
    element.style.perspective = '1000';
    
    // Force hardware acceleration
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    
    // Android-specific fixes
    if (isAndroid) {
      // Add Android-specific class
      element.classList.add('android-fix');
      
      // For Chrome on Android specifically
      if (isChrome) {
        // Use simpler animations for Android Chrome
        element.classList.add('android-chrome');
        
        // Replace complex animations with simpler ones if needed
        if (element.classList.contains('fadeIn')) {
          // Use a simpler animation approach for Android Chrome
          element.style.transition = 'opacity 0.3s linear';
          element.style.opacity = '0';
          
          // Delay slightly to ensure the browser has time to apply the initial state
          setTimeout(() => {
            element.style.opacity = '1';
          }, 50);
        }
      }
    }
  });
  
  // Fix for swipe animations on Android
  if (isAndroid) {
    // If you're using a slider library like Swiper, force hardware acceleration on slide elements
    const slideElements = document.querySelectorAll('.swiper-slide');
    slideElements.forEach(slide => {
      slide.style.transform = 'translate3d(0, 0, 0)';
      slide.style.webkitTransform = 'translate3d(0, 0, 0)';
      slide.style.willChange = 'transform';
    });
  }
});