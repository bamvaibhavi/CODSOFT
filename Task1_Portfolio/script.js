// --- 1. DATA (Easy to Edit) ---
const skills = [
    "JavaScript", "React.js", "Node.js", "Express",
    "MongoDB", "CSS3", "HTML5", "Git", "Python", "SQL"
];

const projects = [
    {
        title: 'Job Board Platform',
        desc: 'A MERN stack application for posting and applying to jobs. Features include employer dashboard, authentication, and database integration.',
        tags: ['MongoDB', 'React', 'Node'],
        links: { github: '#', external: '#' }
    },
    {
        title: 'Galaxy Portfolio',
        desc: 'A personal portfolio website featuring a custom 3D starfield engine built with HTML5 Canvas and vanilla CSS.',
        tags: ['JavaScript', 'Canvas', 'CSS'],
        links: { github: '#', external: '#' }
    },
    {
        title: 'Quiz Maker',
        desc: 'An application for creating and taking quizzes. Features include user authentication, quiz creation, and result tracking.',
        tags: ['JS', 'HTML', 'CSS'],
        links: { github: 'https://bamvaibhavi.github.io/CODSOFT/', external: 'https://bamvaibhavi.github.io/CODSOFT/' }
    }
];

// --- 2. RENDER CONTENT ---
// Inject Skills
const skillContainer = document.getElementById('skill-container');
skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.innerText = skill;
    skillContainer.appendChild(span);
});

// Inject Projects
const projectContainer = document.getElementById('projects-container');
projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-top">
            <i data-lucide="folder" class="folder-icon" size="40"></i>
            <div class="links">
                <a href="${project.links.github}"><i data-lucide="github"></i></a>
                <a href="${project.links.external}"><i data-lucide="external-link"></i></a>
            </div>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.desc}</p>
        <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
    `;
    projectContainer.appendChild(card);
});

// Initialize Icons
lucide.createIcons();

// --- 3. GALAXY ANIMATION (The "Wow" Factor) ---
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');
let width, height, stars = [];

function initStars() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: (Math.random() - 0.5) * width * 2,
            y: (Math.random() - 0.5) * height * 2,
            z: Math.random() * width,
            color: `rgba(200, 230, 255, ${Math.random()})`
        });
    }
}

function animate() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'; // Trail effect
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.z -= 2; // Speed
        if (star.z <= 0) {
            star.z = width;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
        }

        const x = (star.x / star.z) * 100 + width / 2;
        const y = (star.y / star.z) * 100 + height / 2;
        const radius = Math.max(0, (1000 - star.z) / 1000 * 1.5);

        if (x > 0 && x < width && y > 0 && y < height) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        }
    });
    requestAnimationFrame(animate);
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

window.addEventListener('resize', initStars);
initStars();
animate();