document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleCenterColumn');
    const centerColumn = document.getElementById('centerColumn');
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');
  
    toggleButton.addEventListener('click', function() {
      if (centerColumn.style.display === 'none' || centerColumn.style.display === '') {
        centerColumn.style.display = 'block';
        leftColumn.style.flexBasis = '30%';
        rightColumn.style.flexBasis = '30%';
      } else {
        centerColumn.style.display = 'none';
        leftColumn.style.flexBasis = '48%';
        rightColumn.style.flexBasis = '48%';
      }
    });
  });