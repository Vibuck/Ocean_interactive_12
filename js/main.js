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

// =========================================================
// FIX: NỀN XUYÊN SUỐT - DÙNG 1 TIMELINE DUY NHẤT
// =========================================================

// Đảm bảo ảnh bắt đầu đúng vị trí
gsap.set("#all-bg", { yPercent: 0 });

const zoneWrappers = [
    document.querySelector("#sunlight-wrapper")  || document.querySelector(".sunlight-zone"),
    document.querySelector("#twilight-wrapper")  || document.querySelector(".twilight-zone"),
    document.querySelector("#midnight-wrapper")  || document.querySelector(".midnight-zone"),
    document.querySelector("#abyssal-wrapper")   || document.querySelector(".abyssal-zone")
];

// Mỗi tầng chỉ animate từ vị trí hiện tại → vị trí tiếp theo
const yPositions = [0, -20, -40, -60, -80];

zoneWrappers.forEach((zone, index) => {
    if (!zone) return;

    gsap.to("#all-bg", {
        yPercent: yPositions[index + 1],
        ease: "none",
        scrollTrigger: {
            trigger: zone,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false,  // ← Quan trọng! Ngăn GSAP render ngay lập tức
        }
    });
});
// =========================================================
// HIỆU ỨNG TEXT OCEAN REALM TRƯỢT SIÊU MƯỢT
// =========================================================
gsap.to("#text", {
    y: -300,        // Trượt nhẹ chữ lên trên khi cuộn
    opacity: 0,     // Chữ mờ dần đi
    ease: "none",
    scrollTrigger: {
        trigger: ".Ocean_explore",
        start: "top top",
        end: "bottom top", // Kết thúc hiệu ứng khi trang chủ khuất khỏi màn hình
        scrub: true        // "Scrub: true" chính là bảo bối giúp animation dính 1:1 với tốc độ lăn chuột
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

// FIX lỗi mist overlay (đổi oceanZones[0] → zoneWrappers[0])
if (zoneWrappers[0]) {
    gsap.to("#mist-overlay", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: zoneWrappers[0],
            start: "top bottom",
            end: "top top",
            scrub: true
        }
    });
}

// FIX: Refresh sau khi mọi thứ load xong
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.1; 

// Nhạc sẽ phát ngay khi người dùng click lần đầu vào web
document.addEventListener('click', () => {
    bgMusic.play();
}, { once: true }); // { once: true } để lệnh này chỉ chạy 1 lần duy nhất

const soundBtn = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
let allAudios = document.querySelectorAll('audio');
let isMuted = false;

soundBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    
    // Cập nhật lại danh sách audio (để nhận diện các audio mới thêm vào nếu có)
    allAudios = document.querySelectorAll('audio');

    allAudios.forEach(audio => {
        audio.muted = isMuted;
    });

    // Thay đổi giao diện nút
    if (isMuted) {
        soundBtn.classList.add('muted');
        soundBtn.classList.remove('sound-on');
        soundIcon.innerText = "🔇";
        // Nếu muốn dừng hẳn nhạc nền khi tắt âm:
        // bgMusic.pause(); 
    } else {
        soundBtn.classList.remove('muted');
        soundBtn.classList.add('sound-on');
        soundIcon.innerText = "🔊";
        // Phát lại nhạc nền nếu nó đang bị dừng
        // bgMusic.play();
    }
});
