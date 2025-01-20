document.addEventListener('DOMContentLoaded', function() {
  // Forza il browser a creare un nuovo contesto di compositing
  const animatedElements = document.querySelectorAll('.animate');
  animatedElements.forEach(element => {
    element.style.webkitBackfaceVisibility = 'hidden';
    element.style.backfaceVisibility = 'hidden';
    element.style.webkitPerspective = '1000';
    element.style.perspective = '1000';
  });
});
