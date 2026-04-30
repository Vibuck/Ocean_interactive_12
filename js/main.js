gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// EVENTS NAVBAR
document.getElementById('nav-about').onclick = () => {
    document.getElementById('about-overlay').classList.add('active');
    document.getElementById('contact-overlay').classList.remove('active');
};

document.getElementById('nav-contact').onclick = () => {
    document.getElementById('contact-overlay').classList.add('active');
    document.getElementById('about-overlay').classList.remove('active');
};

document.getElementById('nav-home').onclick = () => {
    document.querySelectorAll('.ui-panel').forEach(p => p.classList.remove('active'));
    gsap.to(window, { scrollTo: 0, duration: 1 });
};



// HIỆU ỨNG XUẤT HIỆN NỘI DUNG KHI CUỘN (TÙY CHỌN - GIỮ LẠI ĐỂ WEB KHÔNG BỊ TRỐNG)
const sections = gsap.utils.toArray('.zone-part');
sections.forEach(sec => {
    gsap.from(sec.querySelectorAll('h2'), {
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
});
// ==========================================
// LOGIC MINI DIAGRAM (MAP)
// ==========================================

const navDiagramBtn = document.getElementById('nav-diagram');
const miniDiagram = document.getElementById('mini-diagram');
const diagramHeader = document.getElementById('diagram-header');

// Bật tắt Diagram khi bấm trên Nav
if(navDiagramBtn) {
    navDiagramBtn.onclick = () => {
        miniDiagram.classList.toggle('show');
    };
}

// Chức năng Kéo Thả (Drag & Drop)
let isDragging = false;
let offsetX = 0, offsetY = 0;

diagramHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = miniDiagram.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Xóa right/bottom mặc định để chuyển sang dùng top/left khi kéo
    miniDiagram.style.right = 'auto'; 
    miniDiagram.style.bottom = 'auto';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Tính toán tọa độ mới
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Cập nhật vị trí
    miniDiagram.style.left = `${newX}px`;
    miniDiagram.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Chức năng click "Visit" để cuộn đến tầng
const diagramZones = document.querySelectorAll('.diagram-zone');
diagramZones.forEach(zone => {
    const btn = zone.querySelector('.visit-btn');
    const target = zone.getAttribute('data-target');
    
    btn.onclick = () => {
        // Gsap sẽ lo việc cuộn, nếu đang ở đúng chỗ nó sẽ tự động không làm gì cả
        gsap.to(window, { 
            scrollTo: target, 
            duration: 1.5, 
            ease: "power2.inOut" 
        });
    };
});
let text = document.getElementById('text')
let background = document.getElementById('background1')
let island_ = document.getElementById('island_')
let island_right = document.getElementById('island_right')
let bird_left = document.getElementById('bird_left')
let bird_right = document.getElementById('bird_right')

window.addEventListener('scroll', () => {
    let value = window.scrollY;
    text.style.transform = `translate(-50%, calc(-50% + ${value * 1.5}px))`;
    text.style.opacity = 1 - value * 0.002; 
    bird_left.style.transform = `translate(${value * -1.5}px, ${value * -0.8}px) rotate(${value * -0.05}deg)`; 
    bird_right.style.transform = `translate(${value * 1.5}px, ${value * -0.8}px) rotate(${value * 0.05}deg)`; 

    island_.style.transform = `translateX(${value * -1.5}px) scale(${1 + value * 0.002})`; 
    island_right.style.transform = `translateX(${value * 1.5}px) scale(${1 + value * 0.002})`; 
});

(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var section = document.getElementById('wave-transition');
        if (!section) return;
        var bg2     = section.querySelector('.wt-bg-2');
        var bg3     = section.querySelector('.wt-bg-3');
        var ticking = false;
 
        function update() {
            ticking = false;
            var rect = section.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            var progress = Math.max(0, Math.min(1,
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            var shift = (progress - 0.5) * 50;
            if (bg2) bg2.style.transform = 'scale(1.08) translateY(' + (shift * 0.5) + 'px)';
            if (bg3) bg3.style.transform = 'scale(1.12) translateY(' + (shift * -0.4) + 'px)';
        }
 
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    });
})();