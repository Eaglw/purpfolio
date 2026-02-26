import detectAndroid from '../utils/androidDetection';
// This script specifically targets issues with swipe animations on Android
document.addEventListener('DOMContentLoaded', function() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    
    if (!isAndroid) {
      return; // Only apply fixes on Android
    }
    
    // Check if we're using Swiper (from your package.json dependencies)
    if (typeof Swiper !== 'undefined') {
      // Add a hook after Swiper initializes
      document.addEventListener('swiper:initialized', function(e) {
        const swiper = e.detail.swiper;
        
        // Override some Swiper settings for better Android performance
        if (swiper) {
          // Force hardware acceleration on slide elements
          const slides = swiper.slides;
          if (slides) {
            slides.forEach(slide => {
              slide.style.transform = 'translate3d(0, 0, 0)';
              slide.style.webkitTransform = 'translate3d(0, 0, 0)';
              slide.style.willChange = 'transform';
            });
          }
          
          // Use simpler animations on Android
          swiper.params.speed = 300; // Faster transitions may work better
          swiper.params.virtualTranslate = false; // Disable virtual translate which can cause issues
          swiper.params.cssMode = false; // Disable CSS mode which can be problematic
          
          // Refresh swiper to apply changes
          swiper.update();
        }
      });
      
      // If Swiper is initialized a different way, we need to look for its elements
      const swiperContainers = document.querySelectorAll('.swiper-container, .swiper');
      swiperContainers.forEach(container => {
        // Force hardware acceleration
        container.style.transform = 'translate3d(0, 0, 0)';
        container.style.webkitTransform = 'translate3d(0, 0, 0)';
        
        // Apply to all slides
        const slides = container.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
          slide.style.transform = 'translate3d(0, 0, 0)';
          slide.style.webkitTransform = 'translate3d(0, 0, 0)';
          slide.style.willChange = 'transform';
        });
      });
    }
  });