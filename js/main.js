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

// DIVE BUTTON - CUỘN THẲNG XUỐNG SUNLIGHT
document.getElementById('dive-btn').onclick = () => {
    gsap.to(window, { 
        scrollTo: "#sunlight-wrapper", 
        duration: 1.5, 
        ease: "power2.inOut" 
    });
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