const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.skill-card,.project-item').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = 'rgba(200,169,126,0.8)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.borderColor = 'rgba(200,169,126,0.4)'; });
});
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80); observer.unobserve(entry.target); }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : ''; });
});