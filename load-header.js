fetch('./header.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    // If you have initialization code for the hamburger menu, call it here
    initializeHamburgerMenu();
  })
  .catch(error => console.error('Error loading header:', error));

// Your existing hamburger menu code
function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
    });
  }
}