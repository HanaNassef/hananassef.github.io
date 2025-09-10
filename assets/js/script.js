document.addEventListener('DOMContentLoaded', () => {

    // --- Neural Network Canvas Animation ---
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const particleConfig = {
        count: 100,
        color: 'rgba(137, 185, 224, 0.8)',
        lineColor: 'rgba(137, 185, 224, 0.2)',
        radius: 2,
        speed: 0.5,
        connectionDistance: 120
    };

    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particleConfig.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        if (numberOfParticles > particleConfig.count) numberOfParticles = particleConfig.count;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * particleConfig.radius) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * particleConfig.speed) - (particleConfig.speed / 2);
            let directionY = (Math.random() * particleConfig.speed) - (particleConfig.speed / 2);
            let color = particleConfig.color;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    if (distance < particleConfig.connectionDistance * particleConfig.connectionDistance) {
                        opacityValue = 1 - (distance / (particleConfig.connectionDistance * particleConfig.connectionDistance));
                        ctx.strokeStyle = `rgba(137, 185, 224, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.width / 80));
        init();
    });

    init();
    animate();

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(el => observer.observe(el));

    // --- Active Navigation Link on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, footer');

    const navObserverOptions = {
        threshold: 0.5
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        if (section.id === 'home') {
             new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting){
                     navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#home`) {
                            link.classList.add('active');
                        }
                    });
                }
            }, {threshold: 0.8}).observe(section);
        } else {
            navObserver.observe(section);
        }
    });

    // --- Project Modal Logic ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close-btn');
        const detailsBtns = document.querySelectorAll('.details-btn');

        const modalImgContainer = document.getElementById('modal-img-container');
        const modalTitle = document.getElementById('modal-title');
        const modalTags = document.getElementById('modal-tags');
        const modalDescription = document.getElementById('modal-description');
        const modalLink = document.getElementById('modal-link');

        detailsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.project-card');

                const imgSrc = card.querySelector('.project-image img').src;
                const title = card.querySelector('.project-content h3').innerText;
                const tagsHTML = card.querySelector('.project-tags').innerHTML;
                const descriptionHTML = card.querySelector('.project-details-content').innerHTML;
                const githubLink = card.querySelector('.project-link').href;

                modalImgContainer.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
                modalTitle.innerText = title;
                modalTags.innerHTML = tagsHTML;
                modalDescription.innerHTML = descriptionHTML;
                modalLink.href = githubLink;
                
                modal.classList.add('visible');
            });
        });

        const closeModal = () => {
            modal.classList.remove('visible');
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }
});