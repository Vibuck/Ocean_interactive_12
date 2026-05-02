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
// =========================================================
// GSAP SCROLLTRIGGER: NỀN XUYÊN SUỐT "NHƯ HÌNH VỚI BÓNG"
// =========================================================
gsap.registerPlugin(ScrollTrigger);

// Cơ chế thông minh: Tự động tìm đúng cấu trúc HTML của bạn (Dù bạn dùng ID hay Class)
const zones = [
    document.querySelector("#sunlight-wrapper") || document.querySelector(".sunlight-zone"),
    document.querySelector("#twilight-wrapper") || document.querySelector(".twilight-zone"),
    document.querySelector("#midnight-wrapper") || document.querySelector(".midnight-zone"),
    document.querySelector("#abyssal-wrapper") || document.querySelector(".abyssal-zone")
];

// GSAP thích yPercent thay vì y: "-20%" để đảm bảo không bị lỗi toán học
const yStart = [0, -20, -40, -60];
const yEnd   = [-20, -40, -60, -80]; 

zones.forEach((zone, index) => {
    if (!zone) {
        console.warn("⚠️ Cảnh báo: Không tìm thấy HTML của tầng biển số " + (index + 2));
        return; // Nếu HTML gõ sai tên, bỏ qua để không làm chết/kẹt các tầng khác
    }

    // Lệnh trượt nền "Như hình với bóng"
    gsap.fromTo("#all-bg", 
        { yPercent: yStart[index] }, // Khóa cứng điểm xuất phát
        {
            yPercent: yEnd[index],   // Trượt mượt mà tới điểm tiếp theo
            ease: "none",
            scrollTrigger: {
                trigger: zone,
                start: "top bottom", // Bắt đầu trượt khi ranh giới tầng mới vừa ló lên ở đáy màn hình
                end: "top top",      // Dừng lại hoàn toàn khi tầng mới vừa vặn full màn hình
                scrub: 1,            // Scrub = 1: Nền trượt theo bánh xe chuột một cách mượt mà nhất (1:1 với nội dung)
                immediateRender: false
            }
        }
    );
});

// XỬ LÝ LỚP SƯƠNG MỜ CHO CÁC TẦNG DƯỚI (Nếu tìm thấy tầng 2)
if (zones[0]) {
    gsap.to("#mist-overlay", {
        opacity: 1, 
        ease: "none",
        scrollTrigger: {
            trigger: zones[0],
            start: "top bottom",
            end: "top top",
            scrub: true
        }
    });
}
// Fade out Trang chủ khi cuộn xuống
gsap.to(".Ocean_explore > *", {
    y: -50, // Trượt nhẹ lên
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".Ocean_explore",
        start: "top top",
        end: "bottom top", // Kết thúc hiệu ứng khi trang chủ ra khỏi màn hình
        scrub: true
    }
});

// Animate cho nội dung Sunlight Zone
gsap.from("#sunlight-info", {
    y: 100, // Bắt đầu từ dưới lên
    opacity: 0,
    duration: 1.5, // Kéo dài thời gian để mượt hơn
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#sunlight-wrapper",
        start: "top 80%", // Bắt đầu khi mép trên của Sunlight Zone vào 80% màn hình
        toggleActions: "play none none reverse" // Chơi hiệu ứng khi cuộn xuống, đảo ngược khi cuộn lên
    }
});
gsap.to("#mist-overlay", {
    opacity: 1, 
    ease: "none",
    scrollTrigger: {
        trigger: oceanZones[0], // .sunlight-zone
        start: "top bottom",
        end: "top top",
        scrub: true
    }
});