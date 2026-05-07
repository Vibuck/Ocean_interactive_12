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



// HIỆU ỨNG XUẤT HIỆN NỘI DUNG KHI CUỘN 
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


if(navDiagramBtn) {
    navDiagramBtn.onclick = () => {
        miniDiagram.classList.toggle('show');
    };
}


let isDragging = false;
let offsetX = 0, offsetY = 0;

diagramHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = miniDiagram.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    
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

gsap.set("#all-bg", { yPercent: 0 });

const zoneWrappers = [
    document.querySelector("#sunlight-wrapper")  || document.querySelector(".sunlight-zone"),
    document.querySelector("#twilight-wrapper")  || document.querySelector(".twilight-zone"),
    document.querySelector("#midnight-wrapper")  || document.querySelector(".midnight-zone"),
    document.querySelector("#abyssal-wrapper")   || document.querySelector(".abyssal-zone")
];


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
            immediateRender: false,  
        }
    });
});
// =========================================================
// HIỆU ỨNG TEXT OCEAN REALM TRƯỢT SIÊU MƯỢT
// =========================================================
gsap.to("#text", {
    y: -300,        
    opacity: 0,     
    ease: "none",
    scrollTrigger: {
        trigger: ".Ocean_explore",
        start: "top top",
        end: "bottom top", 
        scrub: true        
    }
});


gsap.from("#sunlight-info", {
    y: 100, 
    opacity: 0,
    duration: 1.5, 
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#sunlight-wrapper",
        start: "top 80%", 
        toggleActions: "play none none reverse" 
    }
});


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


window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.1; 


document.addEventListener('click', () => {
    bgMusic.play();
}, { once: true }); 

const soundBtn = document.getElementById('sound-control');
const soundIcon = document.getElementById('sound-icon');
let allAudios = document.querySelectorAll('audio');
let isMuted = false;

soundBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    
    
    allAudios = document.querySelectorAll('audio');

    allAudios.forEach(audio => {
        audio.muted = isMuted;
    });

    
    if (isMuted) {
        soundBtn.classList.add('muted');
        soundBtn.classList.remove('sound-on');
        soundIcon.innerText = "🔇";
         
    } else {
        soundBtn.classList.remove('muted');
        soundBtn.classList.add('sound-on');
        soundIcon.innerText = "🔊";
        
    }
});
