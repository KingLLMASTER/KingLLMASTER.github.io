document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Optionnel : sauvegarder la préférence de l'utilisateur
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  });

  // Vérifier si l'utilisateur avait précédemment activé le mode sombre
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
  }
});





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