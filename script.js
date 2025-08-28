// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Optional: Show "back to top" button
const backToTop = document.createElement('button');
backToTop.textContent = "↑ Top";
backToTop.style.position = "fixed";
backToTop.style.bottom = "20px";
backToTop.style.right = "20px";
backToTop.style.display = "none";
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
