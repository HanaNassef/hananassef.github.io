
document.querySelectorAll(".toggle-btn").forEach(button => {
  button.addEventListener("click", () => {
    const skillsList = button.nextElementSibling;

    if (skillsList.classList.contains("open")) {
      skillsList.classList.remove("open");
    } else {
      skillsList.classList.add("open");
    }
  });
});



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


function setupSkillHover(skillType) {
  const trigger = document.querySelector(`[data-skill="${skillType}"]`);
  const list = document.getElementById(skillType);

  if (trigger && list) {
    trigger.addEventListener("mouseenter", () => list.style.display = "block");
    trigger.addEventListener("mouseleave", () => list.style.display = "none");
    list.addEventListener("mouseenter", () => list.style.display = "block");
    list.addEventListener("mouseleave", () => list.style.display = "none");
  }
}


setupSkillHover("programming-skills");
setupSkillHover("data-skills");
setupSkillHover("tools-skills");
